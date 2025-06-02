// Import các namespace cần thiết
using AuctionService;              // Namespace chứa các class được generate từ file auctions.proto
using AuctionService.Data;         // Chứa DbContext để truy cập database
using Grpc.Core;                   // Thư viện gRPC chính để dùng ServerCallContext, RpcException, Status,...

// Khai báo service gRPC, kế thừa từ GrpcAuctionBase (được generate từ proto)
public class GrpcAuctionService : GrpcAuction.GrpcAuctionBase
{
    // Inject AuctionDbContext để truy cập dữ liệu phiên đấu giá trong database
    private readonly AuctionDbContext _dbContext;

    // Constructor nhận DbContext thông qua Dependency Injection
    public GrpcAuctionService(AuctionDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Override hàm GetAuction – đây là một RPC method định nghĩa trong file .proto
    public override async Task<GrpcAuctionResponse> GetAuction(GetAuctionRequest request, ServerCallContext context)
    {
        // In ra log khi có request đến
        Console.WriteLine("==> Receive Grpc request for auction");

        // Tìm auction trong DB theo Id từ request (phải parse từ string sang Guid)
        var auction = await _dbContext.Auctions.FindAsync(Guid.Parse(request.Id));

        // Nếu không tìm thấy, trả về lỗi gRPC với mã lỗi NotFound
        if (auction == null)
            throw new RpcException(new Status(StatusCode.NotFound, "Not Found"));

        // Nếu tìm thấy, tạo response và map dữ liệu từ entity sang gRPC model
        var response = new GrpcAuctionResponse
        {
            Auction = new GrpcAuctionModel
            {
                AuctionEnd = auction.AuctionEnd.ToString(),   // Định dạng ngày kết thúc
                Id = auction.Id.ToString(),                   // ID dưới dạng string
                ReservePrice = auction.ReservePrice,          // Giá khởi điểm
                Seller = auction.Seller                       // Người bán
            }
        };

        // Trả lại response cho client gRPC
        return response;
    }
}
