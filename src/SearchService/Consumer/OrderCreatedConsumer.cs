using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService;
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
        Console.WriteLine("Consuming Order Created" + context.Message.Id);
        var product = _mapper.Map<Product>(context.Message);
        await product.SaveAsync();
    }
}