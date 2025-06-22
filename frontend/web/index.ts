
export interface Deposit {
    userId: string;
    amount: number;
}

export interface Order {
    id: string;
    TotalPrice?: number;
    Seller?: string;
    Buyer?: string;
    CreatedAt?: string;
    Status?: string;
    SoldAmount?: number;
    Name: string;
    Description: string;
    Price: number;
    Category: string;
    ImageUrl: string;
    StockQuantity: number;
    Key: string;
    ProductStatus: string;
    SearchCount: number;
}

export interface PageResult<T> {
    results: T[];
    pageCount: number;
    totalCount: number;
}

export type Auction = {
    id: string
    reservePrice: number
    seller: string
    winner?: string
    soldAmount: number
    currentHighBid: number
    createdAt: string
    updatedAt: string
    auctionEnd: string
    status: string
    name: string
    description: string
    year: number
    category: string
    imageUrl: string
    key: string,
    isKeyConfirmed?: boolean | null;
}
export type Bid = {
    id: string
    auctionId: string
    bidder: string
    bidTime: string
    amount: number
    bidStatus: string
}
export type AuctionFinished = {
    itemSold: boolean
    auctionID: string
    winner?: string
    seller: string
    amount?: number
}
