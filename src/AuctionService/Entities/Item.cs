using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuctionService.Entities;


[Table("Items")]
public class Item
{
    public Guid Id { get; set; }
    public String Name { get; set; }
    public String Description { get; set; }
    public int Year { get; set; }
    public String ImageUrl { get; set; }
    public string Key { get; set; }
    public string Category { get; set; }

    public Auction Auction { get; set; }
    public Guid AuctionId { get; set; }

}