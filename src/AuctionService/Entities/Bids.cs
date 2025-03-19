namespace AuctionService.Entites;

public class Bid
{
    public string? ID { get; set; }
    public string? userID { get; set; }
    public int bidAmount { get; set; }
    public DateTime bidTime { get; set; }

    //Foreign key
    public string? auctionID { get; set; }
    public Auction? auction { get; set; }
}
