namespace Contracts;

    public class AuctionFinished
    {
        public bool isSold { get; set; }//items is sold or not
        public Guid auctionID { get; set; }// auction id
        public string sellerID { get; set; }// seller id
        public string winnerID { get; set; }// winner id
        public int? Amount { get; set; }// amount of sold items
    }