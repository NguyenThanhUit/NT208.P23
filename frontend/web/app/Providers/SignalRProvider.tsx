'use client';

import { useBidStore } from "@/hooks/useBidStore";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useParams } from "next/navigation";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useAuctionStore } from "@/hooks/UseAuctionStore";
import { getDetailedViewData } from "../actions/auctionaction";
import { Auction, AuctionFinished, Bid } from "@/index";
import AuctionFinishedToast from "@/components/AuctionFinshiedToast";
import AuctionCreatedToast from "@/components/AuctionCreatedToast";

type Props = {
    children: ReactNode,
};

export default function SignalRProvider({ children }: Props) {
    const session = useSession();
    const user = session.data?.user;

    const connection = useRef<HubConnection | null>(null);
    const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice);
    const addBid = useBidStore(state => state.addBid);
    const params = useParams<{ id: string }>();

    const handleAuctionFinished = useCallback((finishedAuction: AuctionFinished) => {
        const auctionPromise = getDetailedViewData(finishedAuction.auctionID);
        return toast.promise(auctionPromise, {
            loading: 'Loading auction finished data...',
            success: (auction) => (
                <AuctionFinishedToast
                    finishedAuction={finishedAuction}
                    auction={auction}
                />
            ),
            error: () => 'Auction finished with error'
        }, {
            success: { duration: 100000, icon: null }
        });
    }, []);

    const handleAuctionCreated = useCallback((auction: Auction) => {
        if (user?.username !== auction.seller) {
            return toast(<AuctionCreatedToast auction={auction} />, {
                duration: 10000,
            });
        }
    }, [user]);

    const handleBidPlaced = useCallback((bidRaw: any) => {
        const bid: Bid = {
            ...bidRaw,
            auctionId: bidRaw.auctionId ?? bidRaw.auctionID,
        };

        if (bid.bidStatus.includes('Accepted')) {
            setCurrentPrice(bid.auctionId, bid.amount);
        }

        if (params.id === bid.auctionId) {
            addBid(bid);
        }
    }, [setCurrentPrice, addBid, params.id]);

    useEffect(() => {
        const notifyUrl = process.env.NEXT_PUBLIC_NOTIFY_URL!;

        if (!connection.current) {
            connection.current = new HubConnectionBuilder()
                .withUrl(notifyUrl)
                .withAutomaticReconnect()
                .build();

            connection.current
                .start()
                .catch(() => { });
        }

        connection.current.off('BidPlaced');
        connection.current.off('AuctionCreated');
        connection.current.off('AuctionFinished');

        connection.current.on('BidPlaced', handleBidPlaced);
        connection.current.on('AuctionCreated', handleAuctionCreated);
        connection.current.on('AuctionFinished', handleAuctionFinished);

        return () => {
            connection.current?.off('BidPlaced', handleBidPlaced);
            connection.current?.off('AuctionCreated', handleAuctionCreated);
            connection.current?.off('AuctionFinished', handleAuctionFinished);
        };
    }, [handleBidPlaced, handleAuctionCreated, handleAuctionFinished]);

    return <>{children}</>;
}
