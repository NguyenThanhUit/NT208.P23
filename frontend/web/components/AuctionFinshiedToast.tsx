import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Auction, AuctionFinished } from '..'
type Props = {
    finishedAuction: AuctionFinished
    auction: Auction
}

export default function AuctionFinishedToast({ finishedAuction, auction }: Props) {
    return (
        <Link href={`/auctions/details/${auction.id}`} className='flex flex-col items-center'>
            <div className='flex flex-row items-center gap-2'>
                <Image src={auction.imageUrl} alt='Image of car' height={80} width={80} className='rounded-lg w-auto h-auto' />
                <span>New auction: {auction.name} has finished</span>
                {finishedAuction.itemSold && finishedAuction.amount ? (
                    <p>Congrats to {finishedAuction.winner} who has won this auction for ${finishedAuction.amount}</p>
                ) : (
                    <p>This item did not sell</p>
                )}
            </div>
            <div className='flex flex-col'>
                <span>New </span>
            </div>
        </Link>
    )
}
