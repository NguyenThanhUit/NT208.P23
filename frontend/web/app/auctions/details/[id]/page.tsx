import React from 'react';
import CountdownTimer from '../../CountdownTimer';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import BidList from './BidList';
import { getDetailedViewData } from '@/app/actions/auctionaction';
import { getCurrentUser } from '@/app/actions/authactions';
import Heading from '@/components/Heading';
import AuctionImage from '../../AuctionImage';
import DetailedSpecs from './DetailSpecs';

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function Details({ params }: PageProps) {
    const { id } = await params;
    const data = await getDetailedViewData(id);
    const user = await getCurrentUser();

    const isSeller = user?.username === data.seller;

    return (
        <div className="p-6 bg-white shadow-md rounded-lg space-y-6">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <Heading title={data.name} />
                    <span className="text-sm text-gray-500 italic">
                        {isSeller && 'Chủ phiên đấu giá'}
                    </span>
                    {isSeller && (
                        <div className="flex gap-2 mt-2 md:mt-0">
                            <EditButton id={data.id} />
                            <DeleteButton id={data.id} />
                        </div>
                    )}
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg shadow-inner">
                    <h3 className="text-lg font-semibold text-yellow-800">Thời gian còn lại:</h3>
                    <CountdownTimer auctionEnd={data.auctionEnd} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full bg-gray-100 relative aspect-[4/3] rounded-lg overflow-hidden border">
                    <AuctionImage imageUrl={data.imageUrl} />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                    <BidList user={user} auction={data} />
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <DetailedSpecs auction={data} />
            </div>
        </div>
    );
}
