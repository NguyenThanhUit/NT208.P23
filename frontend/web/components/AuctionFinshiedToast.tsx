import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Auction, AuctionFinished } from '..';

type Props = {
    finishedAuction: AuctionFinished;
    auction: Auction;
};

export default function AuctionFinishedToast({ finishedAuction, auction }: Props) {
    return (
        <Link
            href={`/auctions/details/${auction?.id}`}
            className='flex items-center gap-4 p-4 rounded-xl shadow-lg bg-white border hover:bg-gray-50 transition duration-200 w-full max-w-md'
        >
            <div className='relative w-20 h-20 flex-shrink-0'>
                <Image
                    src={auction.imageUrl}
                    alt='Hình ảnh sản phẩm'
                    layout='fill'
                    objectFit='cover'
                    className='rounded-lg'
                />
            </div>

            <div className='flex flex-col'>
                <span className='text-sm text-gray-600 font-medium'>Đấu giá đã kết thúc</span>
                <span className='text-lg font-bold text-gray-800'>{auction.name}</span>

                {finishedAuction.itemSold && finishedAuction.amount ? (
                    <p className='text-green-600 font-medium mt-1'>
                        🎉 Chúc mừng <span className='font-bold'>{finishedAuction.winner}</span> thắng với giá{' '}
                        <span className='font-bold'>{finishedAuction.amount.toLocaleString()} VND</span>
                    </p>
                ) : (
                    <p className='text-gray-500 mt-1'>🕓 Phiên đấu giá này đã kết thúc</p>
                )}
            </div>
        </Link>
    );
}
