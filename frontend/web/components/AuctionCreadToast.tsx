import React from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { Auction } from '..'
type Props = {
    auction: Auction
}

export default function AuctionCreatedToast({ auction }: Props) {
    return (
        <Link href={`/auction/details/${auction.id}`} className='flex flex-col items-center'>
            <div className='flex flex-row items-center gap-2'>
                <Image src={auction.imageUrl} alt='Image of Game' height={80} width={80} className='rounded-lg w-auto h-auto' />
                <span>New auction: {auction.name}  has been added</span>
            </div>
        </Link>
    )
}
