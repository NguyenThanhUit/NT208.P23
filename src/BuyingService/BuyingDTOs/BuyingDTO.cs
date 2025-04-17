namespace BuyingService.Models
{
    public class BuyingDto
    {
        public string ID { get; set; } = string.Empty;              // fix warning
        public string Buyer { get; set; } = string.Empty;           // fix warning
        public int TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;   // fix warning
        public BuyingStatus BuyingStatus { get; set; }

        public List<OrderDto> Items { get; set; } = new();
    }
}
