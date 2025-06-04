import { getDetailedProduct } from '@/app/actions/orderactions';
import ProductForm from '@/components/ProductForm';
import React from 'react';

type PageProps = {
    params: {
        id: string;
    }
}

export default async function update({ params }: PageProps) {
    const data = await getDetailedProduct(params.id);
    console.log('Chi tiết sản phẩm:', data);

    return (
        <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg'>
            <ProductForm defaultValues={data} />
        </div>
    );
}
