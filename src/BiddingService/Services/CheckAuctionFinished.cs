using BiddingServices; // Chứa class Auction, Bid và các enum liên quan
using Contracts;       // Chứa các event contract như AuctionFinished
using MassTransit;
using MongoDB.Entities; // ORM cho MongoDB
namespace BiddingServices;

public class CheckAuctionFinished : BackgroundService
{
    public readonly IServiceProvider _services; // Dùng để tạo scope lấy service phụ thuộc
    public readonly ILogger<CheckAuctionFinished> _logger;

    public CheckAuctionFinished(ILogger<CheckAuctionFinished> logger, IServiceProvider services)
    {
        _logger = logger;
        _services = services;
    }

    // Hàm chính của BackgroundService - chạy khi service khởi động
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting check for finished auctions");

        // Khi token dừng (ứng dụng dừng lại), in log
        stoppingToken.Register(() => _logger.LogInformation("===> Auction check is stopping"));

        // Lặp vô hạn cho đến khi ứng dụng dừng
        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckAuctions(stoppingToken); // Kiểm tra và xử lý các auction đã kết thúc
            await Task.Delay(5000, stoppingToken); // Chờ 5 giây trước khi chạy tiếp
        }
    }

    // Hàm thực hiện việc kiểm tra và xử lý các phiên đấu giá kết thúc
    private async Task CheckAuctions(CancellationToken stoppingToken)
    {
        // Lấy các auction đã hết hạn và chưa được đánh dấu là kết thúc
        var finishedAuctions = await DB.Find<Auction>()
            .Match(x => x.AuctionEnd <= DateTime.UtcNow) // đã đến thời điểm kết thúc
            .Match(x => !x.Finished) // chưa được xử lý
            .ExecuteAsync(stoppingToken);

        if (finishedAuctions.Count == 0) return;

        _logger.LogInformation(" ===> Found {count} auctions that have completed", finishedAuctions.Count);

        // Tạo scope mới để lấy các service theo DI (dependency injection)
        using var scope = _services.CreateScope();
        var endpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>(); // MassTransit hoặc message bus

        foreach (var auction in finishedAuctions)
        {
            // Đánh dấu là đã kết thúc
            auction.Finished = true;
            await auction.SaveAsync(null, stoppingToken); // Lưu vào DB

            // Tìm bid thắng cuộc: bid có status là Accepted, số tiền cao nhất
            var winningBid = await DB.Find<Bid>()
                .Match(a => a.AuctionID == auction.ID)
                .Match(b => b.BidStatus == BidStatus.Accepted)
                .Sort(x => x.Ascending(s => s.Amount)) // Ascending nhưng đáng lý nên là Descending (để lấy giá cao nhất)
                .ExecuteFirstAsync(stoppingToken);

            // Gửi event AuctionFinished
            await endpoint.Publish(new AuctionFinished
            {
                ItemSold = winningBid != null,          // Có người thắng hay không
                AuctionID = auction.ID,                 // ID của phiên đấu giá
                Winner = winningBid?.Bidder,            // Người thắng cuộc (nếu có)
                Amount = winningBid?.Amount,            // Số tiền thắng cuộc
                Seller = auction.Seller                 // Người bán
            });
        }
    }
}
