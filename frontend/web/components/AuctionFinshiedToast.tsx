import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Auction, AuctionFinished } from '..'
type Props = {
    finishedAuction: AuctionFinished
    auction: Auction
}

export default function AuctionFinishedToast({ finishedAuction, auction }: Props) {
    console.log('[AuctionFinishedToast] auction:', auction);
    console.log('[AuctionFinishedToast] finishedAuction:', finishedAuction);

    return (
        <Link href={`/auctions/details/${auction?.id}`} className='flex flex-col items-center'>
            <div className='flex flex-row items-center gap-2'>
                <Image
                    src={auction.imageUrl}
                    alt='Image of car'
                    height={80}
                    width={80}
                    className='rounded-lg w-auto h-auto'
                />
                <span>Đấu giá: {auction.name} đã hoàn thành</span>
                {finishedAuction.itemSold && finishedAuction.amount ? (
                    <p>Chúc mừng {finishedAuction.winner} đã chiến thắng với giá ${finishedAuction.amount}</p>
                ) : (
                    <p>Sản phẩm đã kết thúc</p>
                )}
            </div>
            <div className='flex flex-col'>
                <span>Mới </span>
            </div>
        </Link>
    )
}
