using AutoMapper;
using BuyingService.Models;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BuyingService.Controllers
{
    [ApiController]
    [Route("api/buyings")]
    public class OrdersController : ControllerBase
    {
        private readonly IPublishEndpoint _publishEndpoint;
        private readonly IMapper _mapper;

        public OrdersController(IMapper mapper, IPublishEndpoint publishEndpoint)
        {
            _mapper = mapper;
            _publishEndpoint = publishEndpoint;
        }

        [HttpPost("create")]
        public async Task<ActionResult<BuyingDto>> CreateOrder([FromBody] CreateOrderRequest request)
        {
            var orders = new List<Models.Order>();
            int totalAmount = 0;

            // Tạo từng order cho mỗi item
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

            // Tạo thông tin mua hàng
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

            // Gửi từng item như một sự kiện riêng biệt
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
