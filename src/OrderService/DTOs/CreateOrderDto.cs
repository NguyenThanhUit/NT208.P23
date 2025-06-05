using System.ComponentModel.DataAnnotations;
namespace OrderService.DTOs;

//Tao san pham
public class CreateOrderDto
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public int Price { get; set; }
    [Required]
    public string Category { get; set; }
    [Required]
    public string ImageUrl { get; set; }
    [Required]
    public int StockQuantity { get; set; }
    [Required]
    public int SearchCount { get; set; }
    [Required]
    public string Key { get; set; }
    [Required]
    public string ProductStatus { get; set; }
}