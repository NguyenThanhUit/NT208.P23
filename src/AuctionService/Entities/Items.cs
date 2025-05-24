using System.ComponentModel.DataAnnotations.Schema;
namespace AuctionService.Entities;

[Table("Items")]
public class Items
{
    public Guid ID { get; set; }
    public string name { get; set; }
    public string des { get; set; }
    public string category { get; set; }
    public int price { get; set; }
    public DateTime createdAt { get; set; } = DateTime.UtcNow;
    public DateTime modifiedAt { get; set; } = DateTime.UtcNow;
    public Auction auction { get; set; }
    public Guid auctionID { get; set; }
}