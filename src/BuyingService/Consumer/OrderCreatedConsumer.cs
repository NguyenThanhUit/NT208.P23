using AutoMapper;
using BuyingService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using Microsoft.Extensions.Logging;

namespace BuyingService
{
    public class OrderCreatedConsumer : IConsumer<OrderCreated>
    {
        private readonly ILogger<OrderCreatedConsumer> _logger;
        private readonly IMapper _mapper;

        // Thêm IMapper vào constructor
        public OrderCreatedConsumer(ILogger<OrderCreatedConsumer> logger, IMapper mapper)
        {
            _logger = logger;
            _mapper = mapper;
        }

        public async Task Consume(ConsumeContext<OrderCreated> context)
        {
            try
            {
                var message = context.Message;

                // Log khi nhận message
                _logger.LogInformation($"Received OrderCreated message: {message.Id}, Buyer: {message.Buyer}, TotalPrice: {message.TotalPrice}, CreatedAt: {message.CreatedAt}");

                // Ánh xạ từ OrderCreated sang Order sử dụng AutoMapper
                var order = _mapper.Map<Models.Order>(message);

                // Lưu order vào MongoDB
                await order.SaveAsync();

                _logger.LogInformation($"Order saved successfully with ID: {order.ID}");
            }
            catch (Exception ex)
            {
                // Log nếu có lỗi
                _logger.LogError(ex, "Error occurred while consuming OrderCreated message.");
            }
        }
    }
}
