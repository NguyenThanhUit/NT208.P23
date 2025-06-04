using System.Security.Claims;
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
                    createdAt = DateTime.UtcNow,
                    Finished = false,
                    ProductName = item.ProductName,
                    Quantity = item.Quantity,
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
                    Buyer = buying.Buyer,
                    PaymentMethod = buying.PaymentMethod,
                    TotalAmount = buying.TotalAmount,
                    createdAt = buying.CreatedAt,
                    BuyingStatus = buying.BuyingStatus.ToString(),
                    ProductName = item.ProductName,
                    Quantity = item.Quantity
                };

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
                var body = $"Chào bạn,\n\nĐơn hàng của bạn với mã {buying.ID} đã được tạo thành công.\n" +
                           $"Tổng tiền: {buying.TotalAmount}.\n" +
                           $"Phương thức thanh toán: {buying.PaymentMethod}.\n\n" +
                           "Cảm ơn bạn đã mua hàng!";

                await Task.Delay(10000);

                await _emailSender.SendEmailAsync(userEmail, subject, body);


                buying.BuyingStatus = BuyingStatus.Completed;
                await DB.SaveAsync(buying);

                Console.WriteLine("[LOG] Gửi email thành công và cập nhật trạng thái Completed");
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


    }


    public class ItemRequest
    {
        public string Seller { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public int Price { get; set; }
    }


    public class CreateOrderRequest
    {
        public string Buyer { get; set; }
        public string PaymentMethod { get; set; }
        public List<ItemRequest> Items { get; set; }
    }
}
