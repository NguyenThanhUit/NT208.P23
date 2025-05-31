using AuctionService.Data;  // DbContext để làm việc với database
using Contracts;            // Import các contract như BidPlaced
using MassTransit;          // Thư viện xử lý message broker

namespace AuctionService;

// Consumer để xử lý sự kiện BidPlaced
public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    private readonly AuctionDbContext _dbcontext;

    // Constructor đúng cách
    public BidPlacedConsumer(AuctionDbContext dbcontext)
    {
        _dbcontext = dbcontext;  // Gán DbContext để sử dụng sau này
    }

    // Phương thức xử lý sự kiện BidPlaced
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
