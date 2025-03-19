namespace AuctionService.Entites;

public class Bids
{
    public string? ID { get; set; }
    public string? userID { get; set; }
    public int bidAmount { get; set; }
    public DateTime bidTime { get; set; }

    //Foreign key
    public string? auctionID { get; set; }
    public Auctions? auction { get; set; }
}
