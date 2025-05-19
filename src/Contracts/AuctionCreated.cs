namespace Contracts;

public class AuctionCreated
{
    public Guid ID { get; set; }
    public int reservePrice { get; set; }
    public string sellerID { get; set; }
    public string winnerID { get; set; }
    public int currentHighBid { get; set; }
    public DateTime createdAt { get; set; }
    public DateTime updatedAt { get; set; }
    public DateTime endAt { get; set; }
    public string status { get; set; }
    public string name { get; set; }
    public string des { get; set; }
    public string category { get; set; }
    public int price { get; set; }
    public DateTime itemcreatedAt { get; set; }
    public DateTime modifiedAt { get; set; }
}