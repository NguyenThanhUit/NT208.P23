namespace Contracts
{
    public class AuctionKeyConfirmed
    {
        public Guid AuctionID { get; set; }
        public string Seller { get; set; }
        public decimal Amount { get; set; }
    }
}
