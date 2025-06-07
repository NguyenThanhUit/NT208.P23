namespace OrderService.DTOs;

public class OrderDto
{
    public Guid Id { get; set; }
    public int TotalPrice { get; set; }
    public string Buyer { get; set; } = string.Empty;
    public string Seller { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = string.Empty;
    public int SoldAmount { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ProductId { get; set; }
    public int Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public string Key { get; set; }
    public string ProductStatus { get; set; }
    public string SearchCount { get; set; }
}