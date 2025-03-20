namespace OrderService.Entities;

public class Order
{
    public Guid Id { get; set; }
    public decimal TotalPrice { get; set; }
    public string Buyer { get; set; }
    public string Seller { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int? SoldAmount { get; set; }
    public Product Product { get; set; }
    public Status Status { get; set; } = Status.Pending;
    public Guid ProductId { get; set; }


}
