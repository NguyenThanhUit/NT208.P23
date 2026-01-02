using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OrderService.Entities;

public class Order
{
    [Key]
    public Guid Id { get; set; }
    public int TotalPrice { get; set; }
    public string Buyer { get; set; } = string.Empty;
    public string Seller { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int SoldAmount { get; set; }
    public Status Status { get; set; }

    public Guid ProductId { get; set; }

    [ForeignKey("ProductId")]
    public Product Product { get; set; } = null!;
}