
'use client';
import { useBidStore } from '@/hooks/useBidStore';

import { usePathname } from 'next/navigation';

import React from 'react'




import Countdown, { zeroPad } from 'react-countdown';


type Props = {
    auctionEnd: string;
}


const renderer = ({ days, hours, minutes, seconds, completed }: { days: number, hours: number, minutes: number, seconds: number, completed: boolean }) => {

    return (
        <div className={`
            border-2 border-white text-white py-1 px-2 rounded-lg flex justify-center
            ${completed ? 'bg-red-600' : (days === 0 && hours < 10) ? 'bg-amber-600' : 'bg-green-600'}
        `}>
            {completed ? (
                <span>Phiên đấu giá đã kết thúc</span>

            ) : (
                <span suppressHydrationWarning={true}>{zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>
            )}
        </div>
    )
};

export default function CountdownTimer({ auctionEnd }: Props) {
    const setOpen = useBidStore(state => state.setOpen);
    const pathName = usePathname();
    function auctionFinished() {
        if (pathName.startsWith('/auctions/detais')) {
            setOpen(false)
        }
    }
    return (
        <div>

            <Countdown date={auctionEnd} renderer={renderer} onComplete={auctionFinished} />
        </div>
    )
}
