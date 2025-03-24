namespace Contracts;

    public class Bidplaced
    {
        public enum Status
        {
            Live,
            Finished,
            ReserveNotMet
        }
        public Guid ID { get; set; }
        public Guid auctionID { get; set; }// auction id
        public string bidderID { get; set; }// bidder id
        public DateTime createdAt { get; set; } = DateTime.UtcNow;// initial bid time
        public DateTime endAt { get; set; } = DateTime.UtcNow;// end time of the bid
        public DateTime timeOfBid { get; set; } = DateTime.UtcNow;// time of the bid
        public int HighBid { get; set; } // highest bid of all bids
        public int? Amount { get; set; }// amount of sold items
        public Status status { get; set; } // status of the bid
    }
