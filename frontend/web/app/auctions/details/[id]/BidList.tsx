'use client';


import EmptyFilter from '@/components/EmptyFilter';
import { useBidStore } from '@/hooks/useBidStore';
import { Auction, Bid } from '@/index';
import { User } from 'next-auth';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import BidItem from './BidItem';
import Heading from '@/components/Heading';
import { getBidsForAuction } from '@/app/actions/auctionaction';
import BidForm from './BidForm';



type Props = {
    user: User | null;
    auction: Auction;
};
function getErrorMessage(err: unknown): string {
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message || 'Something went wrong';

    if (typeof err === 'object' && err !== null) {
        const e = err as Record<string, unknown>;


        if (e.message && typeof e.message === 'string' && e.message.trim() !== '') {
            return e.message;
        }

        if (e.status === 404) return 'Không tìm thấy đấu giá nào (404)';
        if (e.status === 500) return 'Internal server error (500)';

        return 'Unexpected error: ' + JSON.stringify(e);
    }

    return 'Unknown error occurred';
}

export default function BidList({ user, auction }: Props) {
    const [loading, setLoading] = useState(true);
    const bids = useBidStore((state) => state.bids);
    const setBids = useBidStore((state) => state.setBids);
    const open = useBidStore((state) => state.open);
    const setOpen = useBidStore((state) => state.setOpen);
    const openForBids = new Date(auction.auctionEnd) > new Date();

    const highBid = bids.reduce(
        (prev, current) =>
            prev > current.amount
                ? prev
                : current.bidStatus.includes('Accepted')
                    ? current.amount
                    : prev,
        0
    );

    useEffect(() => {
        setLoading(true);

        getBidsForAuction(auction.id)
            .then((res: Bid[] | { error: string }) => {
                if ('error' in res) {
                    throw new Error(res.error);
                }
                setBids(res);
            })
            .catch((err: unknown) => {
                const message = getErrorMessage(err);
                console.error('Error fetching bids:', err);
                toast.error(message);
            })
            .finally(() => setLoading(false));
    }, [auction.id, setLoading, setBids]);


    useEffect(() => {
        setOpen(openForBids);
    }, [openForBids, setOpen]);

    if (loading) return <span>Loading bids...</span>;

    return (
        <div className="rounded-lg shadow-md">
            <div className="py-2 px-4 bg-white">
                <div className="sticky top-0 bg-white p-2">
                    <Heading title={`Giá cao nhất hiện tại là: ${highBid}vnđ`} />
                </div>
            </div>

            <div className="overflow-auto h-[400px] flex flex-col-reverse px-2">
                {bids.length === 0 ? (
                    <EmptyFilter
                        title="Chưa có đấu giá nào xảy ra"
                    />
                ) : (
                    <>
                        {bids.map((bid, index) => (
                            <BidItem key={`${bid.id}-${index}`} bid={bid} />
                        ))}
                    </>
                )}
            </div>

            <div className="px-2 pb-2 text-gray-500">
                {!open ? (
                    <div className="flex items-center justify-center p-2 text-lg font-semibold">
                        Đã hết thời gian đấu giá
                    </div>
                ) : !user ? (
                    <div className="flex items-center justify-center p-2 text-lg font-semibold">
                        Vui lòng đăng nhập để đấu giá
                    </div>
                ) : user && user.username === auction.seller ? (
                    <div className="flex items-center justify-center p-2 text-lg font-semibold">
                        Bạn không thể đấu giá vào đấu giá của bạn
                    </div>
                ) : (
                    <BidForm auctionId={auction.id} highBid={highBid} userId={user.username} />
                )}
            </div>
        </div>
    );
}
