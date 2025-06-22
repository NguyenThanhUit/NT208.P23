
using AuctionService;
using AuctionService.Data;
using Grpc.Core;

public class GrpcAuctionService : GrpcAuction.GrpcAuctionBase
{

    private readonly AuctionDbContext _dbContext;


    public GrpcAuctionService(AuctionDbContext dbContext)
    {
        _dbContext = dbContext;
    }


    public override async Task<GrpcAuctionResponse> GetAuction(GetAuctionRequest request, ServerCallContext context)
    {

        Console.WriteLine("==> Receive Grpc request for auction");


        var auction = await _dbContext.Auctions.FindAsync(Guid.Parse(request.Id));


        if (auction == null)
            throw new RpcException(new Status(StatusCode.NotFound, "Not Found"));


        var response = new GrpcAuctionResponse
        {
            Auction = new GrpcAuctionModel
            {
                AuctionEnd = auction.AuctionEnd.ToString(),
                Id = auction.Id.ToString(),
                ReservePrice = auction.ReservePrice,
                Seller = auction.Seller
            }
        };


        return response;
    }
}
