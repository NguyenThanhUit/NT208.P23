// 'use client' để chỉ định rằng component này sẽ được render phía client (Next.js)
'use client';
import { useBidStore } from '@/hooks/useBidStore';
// import { useBidStore } from '@/hooks/useBidStore';
import { usePathname } from 'next/navigation';
// Import React để sử dụng JSX và các hooks nếu cần
import React from 'react'



// Import thư viện react-countdown để tạo đồng hồ đếm ngược
import Countdown, { zeroPad } from 'react-countdown';

// Xác định kiểu dữ liệu Props cho component, với auctionEnd là một chuỗi (string) chứa thời gian kết thúc đấu giá
type Props = {
    auctionEnd: string;
}

// Hàm renderer để tùy chỉnh giao diện của countdown timer
const renderer = ({ days, hours, minutes, seconds, completed }: { days: number, hours: number, minutes: number, seconds: number, completed: boolean }) => {

    return (
        <div className={`
            border-2 border-white text-white py-1 px-2 rounded-lg flex justify-center
            ${completed ? 'bg-red-600' : (days === 0 && hours < 10) ? 'bg-amber-600' : 'bg-green-600'}
        `}>
            {completed ? (
                <span>Auction finished</span>

            ) : (
                <span suppressHydrationWarning={true}>{zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>
            )}
        </div>
    )
};

// Component CountdownTimer nhận vào một prop auctionEnd để xác định thời gian kết thúc đấu giá
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
            {/* Sử dụng thư viện react-countdown, truyền vào thời gian kết thúc (date) và hàm renderer để tùy chỉnh giao diện */}
            <Countdown date={auctionEnd} renderer={renderer} onComplete={auctionFinished} />
        </div>
    )
}
