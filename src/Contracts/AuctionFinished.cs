namespace Contracts;

public class AuctionFinished
{
    public bool itemSold { get; set; }
    public string auctionID { get; set; }
    public string winnerID { get; set; }
    public string sellerID { get; set; }
    public int? Amount { get; set; }
}