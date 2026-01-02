using System.Security.Claims;
using System.Text;
using AutoMapper;
using BuyingService.Models;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BuyingService.Controllers
{
    [ApiController]
    [Route("api/buyings")]
    public class BuyingsController : ControllerBase
    {
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;

        public BuyingsController(IMapper mapper, IPublishEndpoint publishEndpoint, IEmailSender emailSender)
        {
            _mapper = mapper;
            _publishEndpoint = publishEndpoint;
            _emailSender = emailSender;
        }
        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<BuyingDto>> CreateOrder([FromBody] CreateOrderRequest request)
        {
            var orders = new List<Models.Order>();
            int totalAmount = 0;


            foreach (var item in request.Items)
            {
                var order = new Models.Order
                {
                    Seller = item.Seller,
                    ProductId = item.ProductId,
                    createdAt = DateTime.UtcNow,
                    Finished = false,
                    ProductName = item.ProductName,
                    Quantity = item.Quantity,
                    Key = item.Key,
                    Price = item.Price,
                    ProductStatus = item.ProductStatus,
                };

                await DB.SaveAsync(order);
                orders.Add(order);

                totalAmount += item.Quantity * item.Price;
            }

            var buying = new Buying
            {
                OrderId = Guid.NewGuid().ToString(),
                Buyer = request.Buyer,
                PaymentMethod = request.PaymentMethod,
                TotalAmount = totalAmount,
                BuyingStatus = BuyingStatus.Pending,
                Items = orders
            };

            await DB.SaveAsync(buying);

            foreach (var item in buying.Items)
            {
                var eventMessage = new BuyingPlaced
                {
                    Id = buying.ID,
                    orderID = buying.OrderId,
                    ProductId = item.ProductId,
                    Buyer = buying.Buyer,
                    PaymentMethod = buying.PaymentMethod,
                    TotalAmount = buying.TotalAmount,
                    createdAt = buying.CreatedAt,
                    BuyingStatus = buying.BuyingStatus.ToString(),
                    ProductName = item.ProductName,
                    Quantity = item.Quantity,
                    Key = item.Key,
                    Price = item.Price.ToString(),
                    ProductStatus = item.ProductStatus,
                }
            ;

                await _publishEndpoint.Publish(eventMessage);
            }

            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrWhiteSpace(userEmail))
            {
                Console.WriteLine("[ERROR] Không tìm thấy địa chỉ email hợp lệ trong token.");
                return BadRequest("Không thể gửi email vì không tìm thấy địa chỉ email.");
            }

            try
            {
                var subject = $"Thông tin đơn hàng {buying.ID}";

                var bodyBuilder = new StringBuilder();
                bodyBuilder.AppendLine("Chào bạn,");
                bodyBuilder.AppendLine();
                bodyBuilder.AppendLine($"Đơn hàng của bạn với mã {buying.ID} đã được tạo thành công.");
                bodyBuilder.AppendLine($"Tổng tiền: {buying.TotalAmount}.");
                bodyBuilder.AppendLine($"Phương thức thanh toán: {buying.PaymentMethod}.");
                bodyBuilder.AppendLine();
                bodyBuilder.AppendLine("Chi tiết đơn hàng:");

                foreach (var item in buying.Items)
                {
                    bodyBuilder.AppendLine($"- Sản phẩm: {item.ProductName}");
                    bodyBuilder.AppendLine($"  Số lượng: {item.Quantity}");
                    bodyBuilder.AppendLine($"  Giá: {item.Price}");
                    bodyBuilder.AppendLine($"  Mã Key: {item.Key}");
                    bodyBuilder.AppendLine();
                }
                bodyBuilder.AppendLine("Vui lòng click xác nhận trạng thái đơn hàng trong lịch sử mua hàng");
                bodyBuilder.AppendLine("Cảm ơn bạn đã mua hàng!");

                await Task.Delay(10000);

                await _emailSender.SendEmailAsync(userEmail, subject, bodyBuilder.ToString());



            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Lỗi khi gửi email: {ex.Message}");

            }
            return Ok(new
            {
                message = "Đơn hàng đã được tạo thành công",
                data = _mapper.Map<BuyingDto>(buying)
            });
        }



        [HttpGet]
        public async Task<ActionResult<List<BuyingDto>>> GetAllBuyings()
        {
            var buyings = await DB.Find<Buying>().ExecuteAsync();

            if (buyings == null || !buyings.Any())
            {
                return NotFound(new { message = "Không có đơn hàng nào được tìm thấy" });
            }

            var result = _mapper.Map<List<BuyingDto>>(buyings);
            return Ok(result);
        }
        [Authorize]
        [HttpGet("my-buyings")]
        public async Task<ActionResult<List<BuyingDto>>> GetMyBuyings()
        {
            var buyer = User.Identity?.Name;

            if (string.IsNullOrWhiteSpace(buyer))
            {
                return Unauthorized(new { message = "Không xác định được người dùng." });
            }

            var buyings = await DB.Find<Buying>()
                                  .Match(b => b.Buyer == buyer)
                                  .ExecuteAsync();

            if (buyings == null || !buyings.Any())
            {
                return NotFound(new { message = $"Không tìm thấy đơn hàng nào của người dùng {buyer}." });
            }

            var result = _mapper.Map<List<BuyingDto>>(buyings);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("confirm-item/{orderId}")]
        public async Task<IActionResult> ConfirmOrderItem(string orderId, [FromBody] ConfirmItemRequest request)
        {
            var buyer = User.Identity?.Name;
            if (string.IsNullOrWhiteSpace(buyer))
                return Unauthorized(new { message = "Không xác định được người dùng." });


            var buying = await DB.Find<Buying>()
                                 .Match(b => b.OrderId == orderId && b.Buyer == buyer)
                                 .ExecuteFirstAsync();

            if (buying == null)
                return NotFound(new { message = "Không tìm thấy đơn hàng hoặc bạn không có quyền." });


            var item = buying.Items.FirstOrDefault(i => i.ProductId == request.ItemId);
            if (item == null)
                return NotFound(new { message = "Không tìm thấy sản phẩm trong đơn hàng." });


            item.ConfirmedByBuyer = true;

            bool allConfirmed = buying.Items.All(i => i.ConfirmedByBuyer);

            if (allConfirmed)
                buying.BuyingStatus = BuyingStatus.Delivered;

            await DB.SaveAsync(buying);

            return Ok(new
            {
                message = allConfirmed
                    ? "Tất cả sản phẩm đã được xác nhận. Đơn hàng đã hoàn tất."
                    : "Sản phẩm đã được xác nhận. Vui lòng xác nhận các sản phẩm còn lại."
            });
        }
    }

    public class ConfirmItemRequest
    {
        public string ItemId { get; set; } = null!;
    }

    public class ItemRequest
    {
        public string Seller { get; set; }
        public string ProductId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public int Price { get; set; }
        public string ProductStatus { get; set; }
        public string Key { get; set; }
    }


    public class CreateOrderRequest
    {
        public string Buyer { get; set; }
        public string PaymentMethod { get; set; }
        public List<ItemRequest> Items { get; set; }
    }
}
