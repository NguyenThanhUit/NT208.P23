namespace BuyingService.Models
{
    public class OrderDto
    {
        public string ID { get; set; }
        public string Seller { get; set; }
        public string ProductName { get; set; }
        public DateTime createdAt { get; set; }
        public int Quantity { get; set; }
        public bool Finished { get; set; }
        public string Key { get; set; }
        public string ProductStatus { get; set; }
        public string ProductId { get; set; }
        public string Price { get; set; }
    }
}
