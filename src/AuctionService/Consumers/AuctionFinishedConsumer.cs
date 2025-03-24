using MassTransit;
using Contracts;

namespace AuctionService;
public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
{
    public AuctionFinishedConsumer(AucitonDbContext dbContext) 
    {
        _dbContext = dbContext;
    }
    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        Console.WriteLine("---> Consuming AuctionFinished");
        var auction = await context.Auction.FindAsync(context.Message.auctionID);
        if(context.Message.isSold)
        {
            auction.winnerID = context.Message.winnerID;
            auction.Amount = context.Message.Amount;
        }

        auction.Status = auction.Amount > auction.reservePrice
         ? Status.Finished : Status.ReserveNotMet;

        await context.SaveChangesAsync();
    }
}   