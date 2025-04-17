'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePathname, useRouter } from 'next/navigation';
import { createOrder } from '@/app/actions/orderactions';
import { Order } from '..';

type Props = {
    order?: Order;
};

export default function OrderForm({ order }: Props) {
    const router = useRouter();
    const pathName = usePathname();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setFocus,
        reset,
        formState: { errors, isSubmitting, isValid }
    } = useForm<Order>({ mode: 'onChange' });

    useEffect(() => {
        if (order) {
            console.log('[useEffect] Setting form with existing order:', order);
            reset(order);
        }
        setFocus('Name');
    }, [order, reset, setFocus]);

    const onSubmit = async (data: Order) => {
        console.log('[onSubmit] Form submitted with data:', data);
        try {
            let id = '';
            if (pathName === '/Order/Create') {
                const res = await createOrder(data);
                console.log('[onSubmit] Order creation response:', res);
                id = res?.id;
            }

            if (id) {
                console.log('[onSubmit] Redirecting to /Order/' + id);
                router.push(`/Order/Detail/${id}`);
            } else {
                console.error('[onSubmit] Order ID is missing. Something went wrong.');
                setSubmitError('Không thể tạo đơn hàng. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('[onSubmit] Error while creating order:', error);
            setSubmitError('Có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 max-w-4xl mx-auto bg-white border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Tạo đơn hàng</h2>

            {submitError && <p className="text-red-600 text-center">{submitError}</p>}

            <div>
                <label className="block text-sm font-medium text-black mb-2">Product Name</label>
                <input
                    {...register('Name', { required: 'Product name is required' })}
                    className="border border-gray-300 p-4 w-full rounded-md focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                    placeholder="Enter product name"
                />
                {errors.Name && <p className="text-red-500 text-sm mt-1">{errors.Name.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-black mb-2">Description</label>
                <textarea
                    {...register('Description', { required: 'Description is required' })}
                    className="border border-gray-300 p-4 w-full rounded-md focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                    placeholder="Enter product description"
                    rows={4}
                />
                {errors.Description && <p className="text-red-500 text-sm mt-1">{errors.Description.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-black mb-2">Price</label>
                <input
                    type="number"
                    {...register('Price', { required: 'Price is required', min: { value: 0, message: 'Price must be at least 0' } })}
                    className="border border-gray-300 p-4 w-full rounded-md focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                    placeholder="Enter product price"
                />
                {errors.Price && <p className="text-red-500 text-sm mt-1">{errors.Price.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-black mb-2">Category</label>
                <input
                    {...register('Category', { required: 'Category is required' })}
                    className="border border-gray-300 p-4 w-full rounded-md focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                    placeholder="Enter product category"
                />
                {errors.Category && <p className="text-red-500 text-sm mt-1">{errors.Category.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-black mb-2">Image URL</label>
                <input
                    type="url"
                    {...register('ImageUrl', { required: 'Image URL is required' })}
                    className="border border-gray-300 p-4 w-full rounded-md focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                    placeholder="Enter image URL"
                />
                {errors.ImageUrl && <p className="text-red-500 text-sm mt-1">{errors.ImageUrl.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-black mb-2">Stock Quantity</label>
                <input
                    type="number"
                    {...register('StockQuantity', {
                        required: 'Stock quantity is required',
                        min: { value: 0, message: 'Stock must be at least 0' }
                    })}
                    className="border border-gray-300 p-4 w-full rounded-md focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                    placeholder="Enter stock quantity"
                />
                {errors.StockQuantity && <p className="text-red-500 text-sm mt-1">{errors.StockQuantity.message}</p>}
            </div>

            <div className="flex justify-center">
                <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
            </div>
        </form>
    );
}
