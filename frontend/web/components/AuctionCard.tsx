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
        <Link href={`/auctions/details/${auction.id}`} className='group'>
            <div className='relative w-full bg-gray-200 aspect-[16/10] rounded-lg overflow-hidden'>
                <AuctionImage imageUrl={auction.imageUrl} />
                <div className='absolute bottom-2 left-2'>
                    <CountdownTimer auctionEnd={auction.auctionEnd} />
                </div>
                <div className='absolute top-2 right-2'>
                    <CurrentBid reversePrice={auction.reservePrice} amount={auction.currentHighBid} />
                </div>
                <div className='absolute top-2 right-2'>
                </div>
            </div>
            <div className='flex justify-between items-center mt-4'>
                <h3 className='text-gray-700'>{auction.name} {auction.category}</h3>
                <p className='font-semibold text-sm'>{auction.year}</p>
            </div>

        </Link>
    )
}