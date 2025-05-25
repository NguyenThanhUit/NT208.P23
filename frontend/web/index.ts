
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
}

export interface PageResult<T> {
    results: T[];
    pageCount: number;
    totalCount: number;
}
