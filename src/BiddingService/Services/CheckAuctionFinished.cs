using BiddingServices;
using Contracts;
using MassTransit;
using MongoDB.Entities;
namespace BiddingServices;

public class CheckAuctionFinished : BackgroundService
{
    public readonly IServiceProvider _services;
    public readonly ILogger<CheckAuctionFinished> _logger;

    public CheckAuctionFinished(ILogger<CheckAuctionFinished> logger, IServiceProvider services)
    {
        _logger = logger;
        _services = services;
    }


    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting check for finished auctions");

        stoppingToken.Register(() => _logger.LogInformation("===> Auction check is stopping"));

        // Lặp vô hạn cho đến khi ứng dụng dừng
        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckAuctions(stoppingToken);
            await Task.Delay(5000, stoppingToken);
        }
    }


    private async Task CheckAuctions(CancellationToken stoppingToken)
    {

        var finishedAuctions = await DB.Find<Auction>()
            .Match(x => x.AuctionEnd <= DateTime.UtcNow)
            .Match(x => !x.Finished)
            .ExecuteAsync(stoppingToken);

        if (finishedAuctions.Count == 0) return;

        _logger.LogInformation(" ===> Found {count} auctions that have completed", finishedAuctions.Count);


        using var scope = _services.CreateScope();
        var endpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

        foreach (var auction in finishedAuctions)
        {

            auction.Finished = true;
            await auction.SaveAsync(null, stoppingToken);


            var winningBid = await DB.Find<Bid>()
                .Match(a => a.AuctionID == auction.ID)
                .Match(b => b.BidStatus == BidStatus.Accepted)
                .Sort(x => x.Descending(s => s.Amount))
                .ExecuteFirstAsync(stoppingToken);


            await endpoint.Publish(new AuctionFinished
            {
                ItemSold = winningBid != null,
                AuctionID = auction.ID,
                Winner = winningBid?.Bidder,
                Amount = winningBid?.Amount,
                Seller = auction.Seller
            });
        }
    }
}
