namespace AuctionService.Entities;

public class Auction
{
    public Guid ID { get; set; }
    public int reservePrice { get; set; } = 0; 
    public string sellerID { get; set; }
    public string winnerID { get; set; }
    public int currentHighBid { get; set; }
    public DateTime createdAt { get; set; } = DateTime.UtcNow;
    public DateTime updatedAt { get; set; } = DateTime.UtcNow;
    public DateTime endAt { get; set; } = DateTime.UtcNow;
    public Status status { get; set; }
    public Items item { get; set; }
}