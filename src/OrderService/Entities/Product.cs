using System.ComponentModel.DataAnnotations;

namespace OrderService.Entities;

public class Product
{
    [Key]
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public string Key { get; set; }
    public int SearchCount { get; set; }
    public string ProductStatus { get; set; }
}