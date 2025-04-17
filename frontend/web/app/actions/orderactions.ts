'use server';
import { Order, PageResult } from "@/index";
import { fetchWrapper } from "../lib/fetchWrapper";
import { FieldValues } from "react-hook-form";
import { auth } from "@/auth";

export async function getData(query: string): Promise<PageResult<Order>> {
    try {
        // const data = await fetchWrapper.get(`search${query}`);
        const data = await fetchWrapper.get(`search`);
        // console.log("Fetched Data from API:", data);  // Kiểm tra dữ liệu trả về từ API
        return {
            results: data.data?.map((item: any) => ({
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
            })) || [],
            pageCount: data.pageCount || 1,
            totalCount: data.totalCount || 1
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            results: [],
            pageCount: 1,
            totalCount: 0,
        };
    }
}


export async function getDetailedProduct(id: string): Promise<Order> {
    return await fetchWrapper.get(`orders/${id}`);
}

export async function createOrder(data: FieldValues) {
    return await fetchWrapper.post('orders', data);
}
// orderactions.ts

export async function placeBuying(
    orderID: string,
    paymentMethod: string,
    buyer: string,
    items: { seller: string; productName: string; quantity: number }[]
) {
    try {
        const requestData = {
            OrderID: orderID,
            PaymentMethod: paymentMethod,
            Buyer: buyer,
            Items: items,
        };
        console.log("Dữ liệu gửi đi:", requestData);

        const response = await fetch("http://localhost:7003/api/buyings/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage = "Lỗi khi gửi yêu cầu thanh toán";

            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
                console.error("Chi tiết lỗi (JSON):", errorData);
            } else {
                const text = await response.text();
                errorMessage = text || errorMessage;
                console.error("Chi tiết lỗi (Text):", text);
            }

            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi khi thanh toán:", error);
        throw error;
    }
}

export async function getOrderHistory(buyer: string) {
    const response = await fetch(`http://localhost:7003/api/buyings?buyer=${buyer}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch order history");
    }

    return await response.json(); // Trả về danh sách các giao dịch
}


