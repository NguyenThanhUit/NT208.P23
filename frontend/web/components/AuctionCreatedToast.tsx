import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Auction } from '..'

type Props = {
    auction: Auction
}

export default function AuctionCreatedToast({ auction }: Props) {
    return (
        <Link
            href={`/auctions/details/${auction.id}`}
            className="flex items-center gap-4 p-4 bg-white bg-opacity-90 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl"
            role="alert"
        >
            <Image
                src={auction.imageUrl}
                alt={`Image of ${auction.name}`}
                height={80}
                width={80}
                className="rounded-lg object-cover"
            />
            <div className="flex flex-col">
                <span className="font-semibold text-gray-900 text-lg">
                    Một phiên đấu giá mới được tạo ra
                </span>
                <span className="text-gray-700">
                    {auction.name} ({auction.year})
                </span>
            </div>
        </Link>
    )
}
