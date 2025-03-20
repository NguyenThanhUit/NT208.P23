import { Order, PageFormat } from "..";

export async function getData(query: string): Promise<PageFormat<Order>> {
    const res = await fetch(`http:localhost:6001/search?${query}`);
    if (!res) throw new Error('Failed to fetch data');
    return res.json();
}