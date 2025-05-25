import { getDetailedProduct } from '@/app/actions/orderactions';
import ProductForm from '@/components/ProductForm';
import React from 'react'
type PageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function update({ params }: PageProps) {
    const resolvedParams = await params;
    const data = await getDetailedProduct(resolvedParams.id);
    console.log('Chi tiết sản phẩm:', data);
    return (
        <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg'>

        </div>

    )
}
