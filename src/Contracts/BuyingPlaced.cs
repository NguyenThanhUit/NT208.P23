namespace Contracts
{
    public class BuyingPlaced
    {
        public string Id { get; set; }
        public string orderID { get; set; }
        public string Buyer { get; set; }
        public string PaymentMethod { get; set; }
        public int TotalAmount { get; set; }
        public DateTime createdAt { get; set; }
        public string ProductName { get; set; }
        public string BuyingStatus { get; set; }
        public int Quantity { get; set; }
        public string Key { get; set; }
        public string ProductStatus { get; set; }
        public string ProductId { get; set; }
        public string Price { get; set; }
    }
}
