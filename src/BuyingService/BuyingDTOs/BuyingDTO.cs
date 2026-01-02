namespace BuyingService.Models
{
    public class BuyingDto
    {
        public string ID { get; set; } = string.Empty;
        public string Buyer { get; set; } = string.Empty;
        public string OrderId { get; set; }
        public int TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public BuyingStatus BuyingStatus { get; set; }
        public string SellerId { get; set; }
        public List<OrderDto> Items { get; set; } = new();
    }
}
