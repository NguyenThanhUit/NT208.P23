
using MassTransit;
using Contracts;
using MongoDB.Entities;
namespace SearchService;

public class BidPlacedConsumer : IConsumer<Bidplaced>
{
    public async Task Consume(ConsumeContext<Bidplaced> context)
    {
        Console.WriteLine("--> Consuming bid placed");

        var auction = await DB.Find<Item>().OneAsync(context.Message.auctionId);

        if (context.Message.status.Contains("Accepted") 
            && context.Message.Amount > auction.CurrentHighBid)
        {
            auction.CurrentHighBid = context.Message.Amount;
            await auction.SaveAsync();
        }
    }
}