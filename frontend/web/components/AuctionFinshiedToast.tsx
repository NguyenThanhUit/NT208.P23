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
        <Link
            href={`/auction/details/${auction.id}`}
            className="block border rounded-lg shadow-sm hover:shadow-md transition p-4 bg-white"
        >
            <div className="flex items-center gap-2">
                <Image
                    src={auction.imageUrl}
                    alt="Image of car"
                    height={80}
                    width={80}
                    className="rounded-lg object-cover"
                />
                <div className="flex flex-col">
                    <span className="text-sm text-gray-700 font-semibold">
                        New auction: {auction.name} has finished
                    </span>
                    {finishedAuction.itemSold && finishedAuction.amount ? (
                        <p className="text-sm text-green-600">
                            Congrats to {finishedAuction.winner} who has won this auction for ${finishedAuction.amount}
                        </p>
                    ) : (
                        <p className="text-sm text-red-500">This item did not sell</p>
                    )}
                </div>
            </div>
            <div className='flex flex-col'>
                <span>New </span>
            </div>
        </Link>

    )
}
