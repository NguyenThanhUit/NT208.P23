import { getDetailedViewData } from '@/app/actions/auctionaction'
import AuctionForm from '@/components/AuctionForm';
import Heading from '@/components/Heading';

import React from 'react'

type PageProps = {
    params: Promise<{
        id: string;
    }>
}
export default async function Update({ params }: PageProps) {
    const resolvedParams = await params;
    const data = await getDetailedViewData(resolvedParams.id);
    return (
        <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg'>
            <Heading title='Update your auction' subtitle='Please update the details of your car'></Heading>
            <AuctionForm auction={data} />
        </div>
    )
}
