using MongoDB.Entities;

namespace SearchService;

public class Item : Entity
{

    public int ReservePrice { get; set; }
    public String Seller { get; set; }
    public String Winner { get; set; }
    public int SoldAmount { get; set; }
    public int CurrentHighBid { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime AuctionEnd { get; set; }
    public String Status { get; set; }

    public String Name { get; set; }
    public String Description { get; set; }
    public int Year { get; set; }
    public String Category { get; set; }
    public String ImageUrl { get; set; }
    public String Key { get; set; }
}