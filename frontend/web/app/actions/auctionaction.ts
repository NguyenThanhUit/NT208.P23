'use server';

import { fetchWrapper } from '@/app/lib/fetchWrapper';
import { Auction, Bid, PageResult } from '@/index';
import { revalidatePath } from 'next/cache';
import { FieldValues } from 'react-hook-form';

export async function getData(query: string): Promise<PageResult<Auction>> {
    return await fetchWrapper.get(`search/auctions/${query}`)
}
export async function createAuction(data: FieldValues) {
    const response = await fetchWrapper.post('auctions', data);
    return response;
}


export async function getDetailedViewData(id: string) {
    const data = await fetchWrapper.get(`auctions/${id}`)
    return data
}


export async function updateAuction(data: FieldValues, id: string) {
    const res = await fetchWrapper.put(`auctions/${id}`, data);
    revalidatePath(`/auctions/${id}`)
    return res;
}

export async function deleteAuction(id: string) {
    return await fetchWrapper.del(`auctions/${id}`);
}

export async function getBidsForAuction(id: string): Promise<Bid[]> {
    return await fetchWrapper.get(`bids/${id}`);
}
export async function getAuctionWins() {
    return await fetchWrapper.get(`auctions/my-wins`);
}
export async function placeBidForAuction(auctionId: string, amount: number) {
    const response = await fetchWrapper.post(`bids?auctionId=${auctionId}&amount=${amount}`, {});
    return response;
}
export async function confirmAuctionKey(auctionId: string) {
    return await fetchWrapper.post(`auctions/confirm-key/${auctionId}`, {});
}

