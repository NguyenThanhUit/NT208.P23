export interface Order {
    id: string;
    TotalPrice: number; // Kiểu number thay vì string
    Seller: string;
    Buyer: string;
    CreatedAt: string;
    Status: string;
    SoldAmount: number; // Kiểu number thay vì string
    Name: string;
    Description: string;
    Price: number; // Kiểu number thay vì string
    Category: string;
    ImageUrl: string;
    StockQuantity: number;
}


export interface PageResult<T> {
    results: T[];
    pageCount: number;
    totalCount: number;
}
