'use server';
import { FieldValues } from "react-hook-form";
import { fetchWrapper } from "../lib/fetchWrapper";

export async function sendUserInformation(data: FieldValues) {
    const result = await fetchWrapper.post(`users/profile/register`, data);
    return result;
}
export async function getUserInformation() {
    const response = await fetchWrapper.get(`users/profile/me`);
    return response;
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
    const response = await fetchWrapper.post(`users/profile/rate-seller/${username}`, review);
    return response;

}
export async function getRateSeller(username: string) {
    const response = await fetchWrapper.get(`users/profile/seller/rate/${username}`);
    return response;
}
export async function getSellerRank() {
    const response = await fetchWrapper.get(`users/profile/ranked-sellers`);
    return response;
}

