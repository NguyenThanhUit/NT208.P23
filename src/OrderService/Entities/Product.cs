using System.ComponentModel.DataAnnotations.Schema;

namespace OrderService.Entities;

[Table("Products")]
public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public string ImageUrl { get; set; }
    public int StockQuantity { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
