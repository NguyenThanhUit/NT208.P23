import React from 'react'

import Link from 'next/link';

import { Auction } from '..';
import CountdownTimer from '@/app/auctions/CountdownTimer';
import AuctionImage from '@/app/auctions/AuctionImage';
import CurrentBid from '@/app/auctions/CurrentBid';




type Props = {
    auction: Auction;
}

export default function AuctionCard({ auction }: Props) {
    return (
        <Link href={`/auctions/details/${auction.id}`} className="group block transition-transform hover:scale-[1.01]">
            <div className="relative w-full bg-gray-100 aspect-[16/10] rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                <AuctionImage imageUrl={auction.imageUrl} />

                <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-md px-2 py-1 rounded-md text-xs">
                    <CountdownTimer auctionEnd={auction.auctionEnd} />
                </div>

                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-semibold text-green-600">
                    <CurrentBid reversePrice={auction.reservePrice} amount={auction.currentHighBid} />
                </div>
            </div>

            <div className="flex justify-between items-center mt-3 px-1">
                <h3 className="text-gray-800 text-base font-medium group-hover:text-blue-600 transition-colors">
                    {auction.name} - {auction.category}
                </h3>
                <p className="text-sm text-gray-500">{auction.year}</p>
            </div>
        </Link>

    )
}