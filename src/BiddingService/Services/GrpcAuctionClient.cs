using AuctionService;              // Chứa các class được generate từ auctions.proto
using BiddingServices;            // Namespace hiện tại của client
using Grpc.Net.Client;            // Để tạo gRPC channel kết nối đến server

public class GrpcAuctionClient
{
    private readonly ILogger<GrpcAuctionClient> _logger;
    private readonly IConfiguration _config;

    // Constructor: Inject logger và config (để đọc URL gRPC server từ cấu hình)
    public GrpcAuctionClient(ILogger<GrpcAuctionClient> logger, IConfiguration config)
    {
        _logger = logger;
        _config = config;
    }

    // Hàm gọi gRPC server để lấy thông tin một phiên đấu giá theo ID
    public Auction GetAuction(string id)
    {
        _logger.LogInformation("Calling grpc service");

        // Tạo gRPC channel đến địa chỉ cấu hình (ví dụ trong appsettings.json)
        var channel = GrpcChannel.ForAddress(_config["GrpcAuction"]);

        // Tạo client từ channel, class này được sinh ra từ proto
        var client = new GrpcAuction.GrpcAuctionClient(channel);

        // Tạo request với ID cần tìm
        var request = new GetAuctionRequest { Id = id };

        try
        {
            // Gửi request và nhận phản hồi
            var reply = client.GetAuction(request);

            // Map dữ liệu từ gRPC response sang đối tượng Auction nội bộ
            var auction = new Auction
            {
                ID = reply.Auction.Id,
                AuctionEnd = DateTime.Parse(reply.Auction.AuctionEnd),
                Seller = reply.Auction.Seller
            };

            // Trả về kết quả
            return auction;
        }
        catch (Exception ex)
        {
            // Ghi log nếu có lỗi khi gọi gRPC
            _logger.LogError(ex, "Could not call Grpc Server");
            return null;
        }
    }
}
