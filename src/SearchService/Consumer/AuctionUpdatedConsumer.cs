using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService;

namespace SearchService.Consumers;

public class AuctionUpdatedConsumer(IMapper mapper) : IConsumer<AuctionUpdated>
{
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        Console.WriteLine("--> Consuming auction updated: " + context.Message.Id);

        var item = mapper.Map<Item>(context.Message);

        var result = await DB.Update<Item>()
            .Match(a => a.ID == context.Message.Id)
            .ModifyOnly(x => new
            {
                x.Name,
                x.Description,
                x.Category,
                x.Year,
                x.Key
            }, item)
            .ExecuteAsync();

        if (!result.IsAcknowledged)
            throw new MessageException(typeof(AuctionUpdated), "Problem updating mongoDb");
    }
}