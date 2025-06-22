using AuctionService.Data;
using AuctionService.Entities;
using Contracts;
using MassTransit;

namespace AuctionService;

public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
{
    private readonly AuctionDbContext _dbcontext;

    public AuctionFinishedConsumer(AuctionDbContext dbcontext)
    {
        _dbcontext = dbcontext;
    }

    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        var auction = await _dbcontext.Auctions.FindAsync(Guid.Parse(context.Message.AuctionID));
        if (auction == null)
        {
            return;
        }

        if (context.Message.ItemSold)
        {
            auction.Winner = context.Message.Winner;
            auction.SoldAmount = context.Message.Amount;
        }

        auction.Status = auction.SoldAmount > auction.ReservePrice
            ? Status.Finish
            : Status.ReserveNotMet;

        await _dbcontext.SaveChangesAsync();
        Console.WriteLine($"✅ [AuctionFinishedConsumer] Đã cập nhật auction {auction.Id} với trạng thái {auction.Status}");
    }
}
