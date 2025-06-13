'use server';
import { Order, PageResult } from "@/index";
import { fetchWrapper } from "../lib/fetchWrapper";
import { FieldValues } from "react-hook-form";
import { revalidatePath } from "next/cache";
interface ProductItem {
    id: string;
    totalPrice: number;
    seller: string;
    buyer: string;
    createdAt: string;
    status: string;
    soldAmount?: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stockQuantity?: number;
    productStatus: string;
    key: string;
    searchCount?: number;
}

export async function getData(query: string): Promise<PageResult<Order>> {
    try {
        const data = await fetchWrapper.get(`search/products${query}`);
        return {
            results: data.data?.map((item: ProductItem) => ({
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
                ProductStatus: item.productStatus,
                Key: item.key,
                SearchCount: String(item.searchCount || 0),
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
        Key: data.key,
        ProductStatus: data.productStatus,
        SearchCount: data.searchCount,
    };
}

export async function createProduct(data: FieldValues) {
    const result = await fetchWrapper.post(`orders`, data);
    return result;
}



export async function depositMoneyviaVnPay(money: number, description: string) {
    const result = await fetchWrapper.get(`vnpay/CreatePaymentUrl?money=${money}&description=${encodeURIComponent(description)}`);
    return result;
}
export async function handleVnPayReturn(query: string) {
    const result = await fetchWrapper.get(`vnpay/ReturnAction${query}`);
    return result;
}
export async function handleVnPayIpn(query: string) {
    const result = await fetchWrapper.get(`vnpay/IpnAction${query}`);
    return result;
}



export async function updateProduct(data: FieldValues, id: string) {
    const res = await fetchWrapper.put(`orders/${id}`, data);
    revalidatePath(`orders/${id}`);
    return res;
}
export async function getProductForSeller(sellerName: string) {
    const res = await fetchWrapper.get(`orders/by-seller/${sellerName}`);
    return res;
}


export async function deleteProduct(id: string) {
    await fetchWrapper.del(`orders/${id}`);
}
export async function depositMoney(data: { amount: number }) {
    const result = await fetchWrapper.post('wallets/deposit', data);
    return result;
}
export async function initUserMoneyWallet(userId: string, data: FieldValues) {
    const result = await fetchWrapper.post(`wallets/init/${userId}`, data);
    return result;
}


export async function getTotalMoney(userId: string): Promise<{ balance: number }> {
    return await fetchWrapper.get(`wallets/${userId}`);
}
export async function placeBuying(
    orderID: string,
    paymentMethod: string,
    buyer: string,
    items: {
        productId: string,
        seller: string,
        productName: string,
        quantity: number,
        price: number,
        key: string,
        productStatus: string
    }[]
) {
    const data = {
        orderID: orderID,
        Buyer: buyer,
        PaymentMethod: paymentMethod,
        Items: items,
    };

    return await fetchWrapper.post("buyings/create", data);
}

export async function getOrderHistory() {
    return await fetchWrapper.get(`buyings`);
}
export async function getOrderUserHistory() {
    return await fetchWrapper.get(`buyings/my-buyings`);
}
export async function confirmOrder(orderId: string, data: FieldValues) {
    const result = await fetchWrapper.post(`buyings/confirm-item/${orderId}`, data);
    return result;
}
export async function addSellerWaller(sellerId: string, data: FieldValues) {
    const result = await fetchWrapper.post(`wallets/seller/deposit/${sellerId}`, data);
    return result;
}



