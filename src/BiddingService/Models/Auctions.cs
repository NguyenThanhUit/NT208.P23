using MongoDB.Entities;
namespace BiddingServices;

public class Auction : Entity
{
    public DateTime AuctionEnd { get; set; }
    public String Seller { get; set; }
    public int ReservePrice { get; set; }
    public bool Finished { get; set; }

}