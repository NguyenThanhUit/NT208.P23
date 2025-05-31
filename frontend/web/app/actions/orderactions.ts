'use server';
import { Order, PageResult } from "@/index";
import { fetchWrapper } from "../lib/fetchWrapper";
import { FieldValues } from "react-hook-form";
import { revalidatePath } from "next/cache";

export async function getData(query: string): Promise<PageResult<Order>> {
    try {
        // const data = await fetchWrapper.get(`http://localhost:6001/search?${query}`);
        const data = await fetchWrapper.get(`search/products${query}`);
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
    const data = await fetchWrapper.get(`orders/${id}`);
    return {
        id: data.id,
        TotalPrice: data.totalPrice,
        Seller: data.seller,
        Buyer: data.buyer,
        CreatedAt: data.createdAt,
        Status: data.status,
        SoldAmount: Number(data.soldAmount || 0),
        Name: data.name,
        Description: data.description,
        Price: data.price,
        Category: data.category,
        ImageUrl: data.imageUrl,
        StockQuantity: Number(data.stockQuantity || 0),
    };
}


export async function createProduct(data: FieldValues) {
    const result = await fetchWrapper.post(`orders`, data);
    return result;
}

export async function depositMoneyviaVnPay(money: number, description: string) {
    const res = await fetch(
        `http://localhost:6001/vnpay/CreatePaymentUrl?money=${money}&description=${encodeURIComponent(description)}`
    );

    if (!res.ok) {
        throw new Error("Không thể tạo liên kết thanh toán VNPAY");
    }

    const url = await res.text();
    return url;
}



export async function updateProduct(data: FieldValues, id: string) {
    const res = await fetchWrapper.put(`orders/${id}`, data);
    revalidatePath(`orders/${id}`);
    return res;
}
export async function deleteProduct(id: string) {
    await fetchWrapper.del(`orders/${id}`);
}
export async function depositMoney(data: { amount: number }) {
    const result = await fetchWrapper.post('wallets/deposit', data);
    return result;
}
export async function getTotalMoney(userId: string): Promise<{ balance: number }> {
    return await fetchWrapper.get(`wallets/${userId}`);
}



export async function placeBuying(
    orderID: string,
    paymentMethod: string,
    buyer: string,
    items: { seller: string; productName: string; quantity: number; price: number }[]
) {
    try {
        const requestData = {
            OrderID: orderID,
            PaymentMethod: paymentMethod,
            Buyer: buyer,
            Items: items,
        };

        console.log("🛒 Dữ liệu gửi đi:");
        console.log("Order ID:", orderID);
        console.log("Buyer:", buyer);
        console.log("Payment method:", paymentMethod);
        console.log("Danh sách sản phẩm:");

        items.forEach((item, index) => {
            console.log(`  #${index + 1}:`);
            console.log(`    - Tên sản phẩm: ${item.productName}`);
            console.log(`    - Số lượng: ${item.quantity}`);
            console.log(`    - Giá: ${item.price}`);
            console.log(`    - Người bán: ${item.seller}`);
        });

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
        console.error("❌ Lỗi khi thanh toán:", error);
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

    return await response.json()
}


