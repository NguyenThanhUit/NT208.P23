'use server';
import { FieldValues } from "react-hook-form";
import { fetchWrapper } from "../lib/fetchWrapper";

export async function sendUserInformation(data: FieldValues) {
    const result = await fetchWrapper.post(`users/profile/register`, data);
    return result;
}
export async function getUserInformation() {
    try {
        const response = await fetchWrapper.get(`users/profile/me`);
        return response;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        throw error;
    }
}
export async function getSellerInformation(username: string) {
    const response = await fetchWrapper.get(`users/profile/seller/${username}`)
    return response;
}
export async function makeSeller(data: FieldValues) {

    const response = await fetchWrapper.post(`users/profile/seller-request`, data);
    return response;
}

export async function listUsermakeSeller() {
    const response = await fetchWrapper.get(`users/profile/pending-sellers`)
    return response;
}
export async function getSellerDetail(userId: string) {
    const data = await fetchWrapper.get(`users/profile/pending-sellers/${userId}`);
    console.log("getSellerDetail response data:", data);
    return data;
}
export async function approveUser(userId: string, data: FieldValues) {
    const response = await fetchWrapper.put(`users/profile/approve/${userId}`, data);
    return response;
}

export async function rejectUser(userId: string, data: FieldValues) {
    const response = await fetchWrapper.put(`users/profile/reject/${userId}`, data);
    return response;
}

export async function rateSeller(username: string, review: { sellerUserName: string, stars: number; comment: string }) {
    try {
        const response = await fetchWrapper.post(`users/profile/rate-seller/${username}`, review);
        console.log(`[rateSeller] Phản hồi từ server:`, response);
        return response;
    } catch (error) {
        console.error("[rateSeller] Lỗi khi gửi đánh giá người bán:", error);
        throw error;
    }
}
export async function getRateSeller(username: string) {
    const response = await fetchWrapper.get(`users/profile/seller/rate/${username}`);
    return response;
}

