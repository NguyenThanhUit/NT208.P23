namespace Contracts;

public class OrderUpdated
{
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public string Seller { get; set; }
}

