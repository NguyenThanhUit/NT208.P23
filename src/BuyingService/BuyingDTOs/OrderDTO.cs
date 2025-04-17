namespace BuyingService.Models
{
    public class OrderDto
    {
        public string ID { get; set; }
        public string Seller { get; set; }
        public string ProductName { get; set; }
        public DateTime createdAt { get; set; }
        public bool Finished { get; set; }
    }
}
