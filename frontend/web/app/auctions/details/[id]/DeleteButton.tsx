'use client'
import { deleteAuction } from '@/app/actions/auctionaction';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react'
import toast from 'react-hot-toast';

type Props = {
    id: string
}
export default function DeleteButton({ id }: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    function doDelete() {
        setLoading(true);
        deleteAuction(id).then(res => {
            if (res.error) throw res.error;
            router.push('/');
            router.refresh();
            toast.success('Auction deleted successfully!');
        }).catch(error => {
            toast.error(error.status + 'AAAA' + error.message);
        }).finally(() => setLoading(false))
    }
    return (
        <Button color='failure' onClick={doDelete} isProcessing={loading}>
            Xóa đấu giá
        </Button>

    )
}
