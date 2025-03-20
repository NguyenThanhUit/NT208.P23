export type PageFormat<T> = {
    format: T[],
    pageCount: number,
    totalCount: number
}
export type Order = {
    Id: string
    TotalPrice: number
    Buyer?: string
    Seller?: string
    CreatedAt: string
    Status: string
    SoldAmount: string
    Name: string
    Description: string
    Price: number
    Category: string
    ImageUrl: string
    StockQuantity: string

}