using System.ComponentModel.DataAnnotations;

namespace AuctionService.DTOs;

public class CreateAuctionDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public int Year { get; set; }

    [Required]
    public string ImageUrl { get; set; } = string.Empty;

    [Required]
    public int ReservePrice { get; set; }
    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public DateTime AuctionEnd { get; set; }

    [Required]
    public string Key { get; set; } = string.Empty;
}