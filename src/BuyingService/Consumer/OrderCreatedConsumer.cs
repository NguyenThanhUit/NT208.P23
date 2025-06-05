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


                _logger.LogInformation($"Received OrderCreated message: {message.Id}, Buyer: {message.Buyer}, TotalPrice: {message.TotalPrice}, CreatedAt: {message.CreatedAt}");


                var order = _mapper.Map<Models.Order>(message);

                await order.SaveAsync();

                _logger.LogInformation($"Order saved successfully with ID: {order.ID}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while consuming OrderCreated message.");
            }
        }
    }
}
