using AuctionService.Data;
using Contracts;
using MassTransit;

namespace AuctionService;


public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    private readonly AuctionDbContext _dbcontext;


    public BidPlacedConsumer(AuctionDbContext dbcontext)
    {
        _dbcontext = dbcontext;
    }


    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("--> Consuming bid placed");
        var auction = await _dbcontext.Auctions.FindAsync(Guid.Parse(context.Message.AuctionID));
        if (auction.CurrentHighBid == null || context.Message.BidStatus.Contains("Accepted") && context.Message.Amount > auction.CurrentHighBid)
        {
            auction.CurrentHighBid = context.Message.Amount;
            await _dbcontext.SaveChangesAsync();
        }
    }
}
