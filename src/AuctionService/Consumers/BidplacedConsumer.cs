using Contracts;
using MassTransit;

namespace AuctionService;
public class BidplacedConsumer : IConsumer<Bidplaced>
{
    public BidplacedConsumer(AuctionDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task Consume(ConsumeContext<Bidplaced> context)
    {
        Console.WriteLine("---> Consuming Bidplaced");

        var aution = await _dbContext.Auctions.FindAsync(context.Message.auctionID);

        if(aution.HighestBid == null || context.Message.status.Contains("Accepted")
                && context.Message.Amount > aution.HighBid)
        {
            aution.HightBid = context.Message.Amount;
            await _dbContext.SaveChangesAsync();
        }
    }
}