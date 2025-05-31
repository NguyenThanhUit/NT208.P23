'use client'
import { Button } from 'flowbite-react'
import React from 'react'
import Heading from './Heading'
import { signIn } from '@/auth'
import { useParamStore } from '@/hooks/useParamStore'
type Props = {
    title?: string
    subtitle?: string
    showReset?: boolean,
    showLogin?: boolean,
    callbackUrl?: string
}

export default function EmptyFilter({
    title = 'Không tìm thấy bộ lọc nào phù hợp',
    subtitle = 'Vui lòng reset lại',
    showReset,
    showLogin,
    callbackUrl,
}: Props) {
    const reset = useParamStore(state => state.reset);
    return (
        <div className='h-[40vh] flex flex-col gap-2 justify-center items-center shadow-lg'>
            <Heading title={title} subtitle={subtitle} center />
            <div className='mt-4'>
                {showReset && (
                    <Button outline onClick={reset}>Xóa bộ lọc</Button>
                )}
                {showLogin && (
                    <Button outline onClick={() => signIn('id-server', { callbackUrl })}>Login</Button>
                )}
            </div>
        </div>
    )
}
