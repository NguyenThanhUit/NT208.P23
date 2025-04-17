using MongoDB.Entities;

namespace BuyingService.Models;

public class Order : Entity
{
    public string Seller { get; set; }
    public DateTime createdAt { get; set; }
    public string ProductName { get; set; }
    public bool Finished { get; set; }
}
