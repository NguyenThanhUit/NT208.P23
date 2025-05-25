import { Order, PageResult } from "..";

export async function getData(query: string): Promise<PageResult<Order>> {
    try {
        console.log(`Fetching data from: http://localhost:6001/search?${query}`);

        const res = await fetch(`http://localhost:6001/search?${query}`);
        if (!res.ok) {
            const errorText = await res.text();
            console.error("API Response Error:", res.status, errorText);
            throw new Error(`Lỗi khi tải dữ liệu: ${res.status} - ${errorText}`);
        }

        const responseData = await res.json();
        console.log("Fetched raw data:", JSON.stringify(responseData, null, 2));

        // Chuyen doi du lieu
        const formattedData: PageResult<Order> = {
            results: responseData.data.map((item: any) => ({
                id: item.id,
                TotalPrice: item.totalPrice,
                Seller: item.seller,
                Buyer: item.buyer,
                CreatedAt: item.createdAt,
                Status: item.status,
                SoldAmount: String(item.soldAmount || 0),
                Name: item.name,
                Description: item.description,
                Price: item.price,
                Category: item.category,
                ImageUrl: item.imageUrl,
                StockQuantity: String(item.stockQuantity || 0),
            })),
            pageCount: responseData.pageCount || 1,
            totalCount: responseData.total || 0,
        };

        console.log("Formatted Data:", formattedData);
        return formattedData;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}
