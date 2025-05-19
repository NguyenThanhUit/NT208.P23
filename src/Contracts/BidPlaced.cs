namespace Contracts;

public class BidPlaced
{
    public string ID { get; set; }
    public string auctionID { get; set; }
    public string bidderID { get; set; }
    public DateTime bidTime { get; set; }
    public int Amount { get; set; }
    public string Status { get; set; } // "Pending" or "Accepted"
}