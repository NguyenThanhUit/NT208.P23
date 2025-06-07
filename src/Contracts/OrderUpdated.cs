namespace Contracts;

public class OrderUpdated
{
    public Guid OrderId { get; set; }
    public string ProductId { get; set; }
    public int Quantity { get; set; }
    public string Seller { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
}
