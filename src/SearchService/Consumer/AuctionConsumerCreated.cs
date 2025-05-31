
using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;


namespace SearchService;

public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
    public readonly IMapper _mapper;

    public AuctionCreatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
        Console.WriteLine("AuctionCreatedConsumer is created");
    }

    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.WriteLine("Consuming Auction Created" + context.Message.Id);
        var item = _mapper.Map<Item>(context.Message);
        await item.SaveAsync();
    }
}
