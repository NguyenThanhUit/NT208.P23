
namespace AuctionService.DTOs;

public class UpdateAuctionDto
{
    public String Name { get; set; }
    public String Description { get; set; }
    public int? Year { get; set; }
    public string Key { get; set; }
    public string Category { get; set; }
}