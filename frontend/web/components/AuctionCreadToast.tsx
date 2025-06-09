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
            href={`/auction/details/${auction.id}`}
            className="flex items-center gap-4 p-4 bg-white bg-opacity-90 shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl"
        >
            <div className="flex flex-row items-center gap-4">
                <Image
                    src={auction.imageUrl}
                    alt="Image of Game"
                    height={80}
                    width={80}
                    className="rounded-lg w-[80px] h-[80px] object-cover shadow-sm"
                />
            </div>
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
