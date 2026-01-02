using System.ComponentModel.DataAnnotations;
using MongoDB.Entities;

namespace BuyingService.Models;

public class Buying : Entity
{
    [Required]
    public string OrderId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Buyer { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = "cash";
    public int TotalAmount { get; set; }
    public BuyingStatus BuyingStatus { get; set; } = BuyingStatus.Pending;
    public List<Order> Items { get; set; } = new();
}
