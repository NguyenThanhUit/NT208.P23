namespace AuctionService.Entites;

public class Auctions
{
    public string? ID { get; set; }
    public string? productID { get; set; }
    public string? sellerID { get; set; }
    public int startPrice { get; set; }
    public int currentPrice { get; set; }
    public int bidStep { get; set; }
    public DateTime startTime { get; set; }
    public DateTime endTime { get; set; }
    public string winnerID { get; set; } = "";
}
