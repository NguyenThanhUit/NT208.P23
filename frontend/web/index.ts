export interface Order {
    id: string;
    TotalPrice: number;
    Seller: string;
    Buyer: string;
    CreatedAt: string;
    Status: string;
    SoldAmount: string;
    Name: string;
    Description: string;
    Price: number;
    Category: string;
    ImageUrl: string;
    StockQuantity: string;
}

export interface PageResult<T> {
    results: T[];
    pageCount: number;
    totalCount: number;
}
