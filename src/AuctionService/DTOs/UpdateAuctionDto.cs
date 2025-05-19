namespace AuctionService.DTOs;

public class UpdateAuctionDto
{
    public string name { get; set; }
    public string des { get; set; }
    public string category { get; set; }
    public int? price { get; set; }
}