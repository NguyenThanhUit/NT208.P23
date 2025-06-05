using MongoDB.Entities;

namespace BuyingService.Models;

public class Order : Entity
{
    public string ProductId { get; set; }
    public string Seller { get; set; }
    public DateTime createdAt { get; set; }
    public string ProductName { get; set; }
    public int Quantity { get; set; }
    public bool Finished { get; set; }
    public string Key { get; set; }
    public string ProductStatus { get; set; }
    public bool ConfirmedByBuyer { get; set; }
    public int Price { get; set; }

}
