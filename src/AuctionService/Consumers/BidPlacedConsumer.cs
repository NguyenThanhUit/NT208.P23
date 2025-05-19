using AuctionService.Data;
using AuctionService.Entities;
using Contracts;
using MassTransit;
namespace Consumers;

public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    private readonly AuctionDbContext _dbContext;

    public BidPlacedConsumer(AuctionDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("--> Consuming bid placed");

        var auction = await _dbContext.Auctions.FindAsync(context.Message.auctionID);

        if (auction.currentHighBid == null
            || context.Message.Status == "Accepted"
            && context.Message.Amount > auction.currentHighBid)
        {
            auction.currentHighBid = context.Message.Amount;
            await _dbContext.SaveChangesAsync();
        }

        
    }
}