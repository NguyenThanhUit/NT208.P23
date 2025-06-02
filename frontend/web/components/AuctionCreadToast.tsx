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
            className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
            <div className="flex flex-row items-center gap-4">
                <Image
                    src={auction.imageUrl}
                    alt="Image of Game"
                    height={80}
                    width={80}
                    className="rounded-lg w-[80px] h-[80px] object-cover shadow-sm"
                />
                <span className="text-gray-800 text-sm font-medium">
                    New auction: <span className="font-semibold">{auction.name}</span> has been added!
                </span>
            </div>
        </Link>

    )
}
