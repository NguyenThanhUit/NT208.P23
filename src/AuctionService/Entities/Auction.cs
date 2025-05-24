using System;

namespace AuctionService.Entities
{
    public class Auction
    {
        public Guid ID { get; set; }
        public int? ReservePrice { get; set; } = 0; 
        public string SellerID { get; set; }
        public string WinnerID { get; set; }
        public int CurrentHighBid { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime EndAt { get; set; } = DateTime.UtcNow;
        public Status Status { get; set; }
        public Items Item { get; set; }
    }
}