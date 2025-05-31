
import AuctionForm from '@/components/AuctionForm'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

export default function Create() {
    return (
        <SessionProvider>
            <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg'>
                <AuctionForm></AuctionForm>
            </div>
        </SessionProvider>
    )
}
