using Contracts;
using MassTransit;
using AuctionService.Entities;
using AuctionService.Data;

namespace Consumers;

public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
{
    private readonly AuctionDbContext _context;
    public AuctionFinishedConsumer(AuctionDbContext context)
    {
        _context = context;
    }
    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        var auction = await _context.Auctions.FindAsync(context.Message.auctionID);
        if (context.Message.itemSold)
        {
            auction.winnerID = context.Message.winnerID;
            auction.reservePrice = context.Message.Amount;
        }
        auction.status = auction.reservePrice > auction.reservePrice ? Status.Finished : Status.ReserveNotMet;
        await _context.SaveChangesAsync();
    }
}
