'use client'

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
}

export default function SignalRProvider({ children }: Props) {
    const session = useSession();
    const user = session.data?.user;

    const connection = useRef<HubConnection | null>(null);
    const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice);
    const addBid = useBidStore(state => state.addBid);
    const params = useParams<{ id: string }>();

    const handleAuctionFinished = useCallback((finishedAuction: AuctionFinished) => {
        const auction = getDetailedViewData(finishedAuction.auctionId);
        return toast.promise(auction, {
            loading: 'Loading',
            success: (auction) => <AuctionFinishedToast
                finishedAuction={finishedAuction}
                auction={auction} />,
            error: () => 'Auction finished'
        }, { success: { duration: 100000, icon: null } });
    }, []);

    const handleAuctionCreated = useCallback((auction: Auction) => {


        if (user?.username !== auction.seller) {
            return toast(<AuctionCreatedToast auction={auction} />, {
                duration: 10000,
            });
        } else {
            console.log('[SignalR] AuctionCreated event ignored because user is the seller');
        }
    }, [user]);

    const handleBidPlaced = useCallback((bid: Bid) => {
        if (bid.bidStatus.includes('Accepted')) {
            setCurrentPrice(bid.auctionId, bid.amount);
        }

        if (params.id === bid.auctionId) {
            addBid(bid);
        }
    }, [setCurrentPrice, addBid, params.id]);

    useEffect(() => {
        if (!connection.current) {
            connection.current = new HubConnectionBuilder()
                .withUrl(process.env.NEXT_PUBLIC_NOTIFY_URL!)
                .withAutomaticReconnect()
                .build();

            connection.current.start()
                .then(() => console.log('[SignalR] Connected to notification hub'))
                .catch(err => console.error('[SignalR] Error connecting to SignalR hub:', err));
        }

        connection.current.on('BidPlaced', (bid: Bid) => {
            handleBidPlaced(bid);
        });

        connection.current.on('AuctionCreated', (auction: Auction) => {
            handleAuctionCreated(auction);
        });

        connection.current.on('AuctionFinished', (finishedAuction: AuctionFinished) => {
            handleAuctionFinished(finishedAuction);
        });

        return () => {
            connection.current?.off('BidPlaced', handleBidPlaced);
            connection.current?.off('AuctionCreated', handleAuctionCreated);
            connection.current?.off('AuctionFinished', handleAuctionFinished);
        };

    }, [handleBidPlaced, handleAuctionCreated, handleAuctionFinished]);

    return (
        <>
            {children}
        </>
    );
}
