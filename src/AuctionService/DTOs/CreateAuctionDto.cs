using System.ComponentModel.DataAnnotations;
namespace AuctionService.DTOs;

public class CreateAuctionDto
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string Description  { get; set; }
    [Required]
    public string Category  { get; set; }
    [Required]
    public int Price { get; set; }
    [Required]
    public int ReservePrice { get; set; }
    [Required]
    public DateTime AuctionEnd { get; set; }
}