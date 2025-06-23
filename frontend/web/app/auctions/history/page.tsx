'use client';

import { useEffect, useState } from 'react';
import { getAuctionWins, confirmAuctionKey } from '@/app/actions/auctionaction';
import { Auction } from '@/index';
import Link from 'next/link';
import Image from 'next/image';
import Heading from '@/components/Heading';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuctionHistoryPage() {
    const { data: session, status } = useSession();
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [showKeys, setShowKeys] = useState<{ [id: string]: boolean }>({});
    const router = useRouter();

    useEffect(() => {
        if (status !== 'authenticated') return;

        getAuctionWins()
            .then((res: Auction[] | { error: string }) => {
                if ('error' in res) throw new Error(res.error);
                setAuctions(res);
            })
            .catch(err => {
                console.error('❌ Lỗi khi tải lịch sử đấu giá:', err);
            })
            .finally(() => setLoading(false));
    }, [status]);

    const handleConfirm = async (auctionId: string) => {
        setConfirmingId(auctionId);
        try {
            await confirmAuctionKey(auctionId);
        } finally {
            setConfirmingId(null);
            window.location.reload();
        }
    };



    const toggleShowKey = (auctionId: string) => {
        setShowKeys((prev) => ({
            ...prev,
            [auctionId]: !prev[auctionId],
        }));
    };

    if (status === 'loading') {
        return <div className="p-4 text-center text-gray-600">🔐 Đang xác thực người dùng...</div>;
    }

    if (status === 'unauthenticated') {
        return <div className="p-4 text-center text-red-600">❌ Vui lòng đăng nhập để xem lịch sử đấu giá.</div>;
    }

    return (
        <div className="min-h-screen p-4 bg-white">
            <Heading title={`Lịch sử đấu giá đã thắng của ${session?.user?.name}`} />
            {message && (
                <div className="text-center py-2 text-sm font-medium text-blue-700">{message}</div>
            )}
            {loading ? (
                <div className="p-4 text-center text-gray-600">⏳ Đang tải lịch sử đấu giá...</div>
            ) : auctions.length === 0 ? (
                <div className="text-gray-600 mt-4">Bạn chưa thắng phiên đấu giá nào.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {auctions.map((auction) => {
                        const isConfirmed = auction.isKeyConfirmed === true;
                        const isWinner = session?.user?.username === auction.winner;
                        const hasKey = !!auction.key;

                        return (
                            <div
                                key={auction.id}
                                className="border rounded-lg p-3 hover:shadow-md transition"
                            >
                                <Link href={`/auctions/details/${auction.id}`}>
                                    <Image
                                        src={auction.imageUrl}
                                        alt={auction.name}
                                        width={300}
                                        height={200}
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                </Link>
                                <div className="mt-2">
                                    <h2 className="text-lg font-bold">{auction.name}</h2>
                                    <p className="text-sm text-gray-500">Năm phát hành: {auction.year}</p>
                                    <p className="text-sm text-green-700 font-medium">
                                        Số tiền thắng: {auction.soldAmount?.toLocaleString()} VND
                                    </p>

                                    {hasKey && (
                                        <div className="mt-2">
                                            <button
                                                onClick={() => toggleShowKey(auction.id)}
                                                className="text-sm text-blue-600 underline mb-1"
                                            >
                                                {showKeys[auction.id] ? 'Ẩn key 🔒' : 'Hiện key 👁'}
                                            </button>
                                            {showKeys[auction.id] && (
                                                <p className="text-sm bg-gray-100 p-2 rounded text-gray-800 font-mono">
                                                    {auction.key}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {isWinner && (
                                        <div className="mt-2">
                                            {isConfirmed ? (
                                                <p className="text-sm text-green-600 font-medium">
                                                    ✅ Key đã xác nhận
                                                </p>
                                            ) : (
                                                <button
                                                    onClick={() => handleConfirm(auction.id)}
                                                    className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                                                    disabled={confirmingId === auction.id}
                                                >
                                                    {confirmingId === auction.id
                                                        ? 'Đang xác nhận...'
                                                        : 'Xác nhận key'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
