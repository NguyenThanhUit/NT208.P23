'use server';

import { fetchWrapper } from '@/app/lib/fetchWrapper';
import { Auction, Bid, PageResult } from '@/index';
import { revalidatePath } from 'next/cache';
import { FieldValues } from 'react-hook-form';

export async function getData(query: string): Promise<PageResult<Auction>> {
    return await fetchWrapper.get(`search/auctions/${query}`)
}

export async function updateAuctionTest() {
    const data = {
        mileage: Math.floor(Math.random() * 10000) + 1
    }

    return await fetchWrapper.put('auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c', data);
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

export async function placeBidForAuction(auctionId: string, amount: number) {
    try {
        const response = await fetchWrapper.post(`bids?auctionId=${auctionId}&amount=${amount}`, {});
        return response;
    } catch (error) {
        console.error('Error in placeBidForAuction:', error);
    }
}
