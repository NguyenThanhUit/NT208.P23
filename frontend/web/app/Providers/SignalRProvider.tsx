'use client'

import { useBidStore } from "@/hooks/useBidStore";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useParams } from "next/navigation";
import { ReactNode, useCallback, useEffect, useRef } from "react"
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useAuctionStore } from "@/hooks/UseAuctionStore";
import { getDetailedViewData } from "../actions/auctionaction";
import { Auction, AuctionFinished, Bid } from "@/index";
import AuctionFinishedToast from "@/components/AuctionFinshiedToast";
import AuctionCreatedToast from "@/components/AuctionCreadToast";

type Props = {
    children: ReactNode,
}

export default function SignalRProvider({ children }: Props) {
    const session = useSession();
    const user = session.data?.user;

    const connection = useRef<HubConnection | null>(null);
    const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice);
    const addBid = useBidStore(state => state.addBid);
    const params = useParams<{ id: string }>();

    const handleAuctionFinished = useCallback((finishedAuction: AuctionFinished) => {
        console.log('[SignalR] AuctionFinished event received:', finishedAuction);
        const auction = getDetailedViewData(finishedAuction.auctionId);
        return toast.promise(auction, {
            loading: 'Loading',
            success: (auction) => <AuctionFinishedToast
                finishedAuction={finishedAuction}
                auction={auction} />,
            error: () => 'Auction finished'
        }, { success: { duration: 10000, icon: null } });
    }, []);

    const handleAuctionCreated = useCallback((auction: Auction) => {
        console.log('[SignalR] AuctionCreated event received:', auction);
        if (user?.username !== auction.seller) {
            return toast(<AuctionCreatedToast auction={auction} />, {
                duration: 10000,
            });
        }
    }, [user]);

    const handleBidPlaced = useCallback((bid: Bid) => {
        console.log('[SignalR] BidPlaced event received:', bid);
        if (bid.bidStatus.includes('Accepted')) {
            setCurrentPrice(bid.auctionId, bid.amount);
        }

        if (params.id === bid.auctionId) {
            addBid(bid);
        }
    }, [setCurrentPrice, addBid, params.id]);

    useEffect(() => {
        if (!connection.current) {
            console.log('[SignalR] Creating new connection with URL:', process.env.NEXT_PUBLIC_NOTIFY_URL);
            connection.current = new HubConnectionBuilder()
                .withUrl(process.env.NEXT_PUBLIC_NOTIFY_URL!)
                .withAutomaticReconnect()
                .build();

            connection.current.start()
                .then(() => console.log('[SignalR] Connected to notification hub'))
                .catch(err => console.error('[SignalR] Error connecting to SignalR hub:', err));
        }

        connection.current.on('BidPlaced', (bid: Bid) => {
            console.log('[SignalR] Received BidPlaced event from server:', bid);
            handleBidPlaced(bid);
        });

        connection.current.on('AuctionCreated', (auction: Auction) => {
            console.log('[SignalR] Received AuctionCreated event from server:', auction);
            handleAuctionCreated(auction);
        });

        connection.current.on('AuctionFinished', (finishedAuction: AuctionFinished) => {
            console.log('[SignalR] Received AuctionFinished event from server:', finishedAuction);
            handleAuctionFinished(finishedAuction);
        });

        return () => {
            console.log('[SignalR] Cleaning up event listeners');
            connection.current?.off('BidPlaced', handleBidPlaced);
            connection.current?.off('AuctionCreated', handleAuctionCreated);
            connection.current?.off('AuctionFinished', handleAuctionFinished);
        };

    }, [handleBidPlaced, handleAuctionCreated, handleAuctionFinished]);

    return (
        <>{children}</>
    );
}
