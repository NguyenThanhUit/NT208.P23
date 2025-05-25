using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService;
using System.Text.Json;

namespace OrderService;

public class OrderCreatedConsumer : IConsumer<OrderCreated>
{
    public readonly IMapper _mapper;
    public OrderCreatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }

    public async Task Consume(ConsumeContext<OrderCreated> context)
    {
        // Log Id đơn giản
        Console.WriteLine("Consuming Order Created, Id: " + context.Message.Id);

        // Log toàn bộ nội dung message dưới dạng JSON, pretty print cho dễ đọc
        var jsonMessage = JsonSerializer.Serialize(context.Message, new JsonSerializerOptions { WriteIndented = true });
        Console.WriteLine("OrderCreated message content:\n" + jsonMessage);

        // Map và save
        var product = _mapper.Map<Product>(context.Message);
        await product.SaveAsync();
    }
}
