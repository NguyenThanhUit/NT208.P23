'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    FiTag,
    FiDollarSign,
    FiPackage,
    FiImage,
    FiList,
    FiAlignLeft,
} from 'react-icons/fi';

import { getCurrentUser } from '@/app/actions/authactions';
import { createProduct, updateProduct } from '@/app/actions/orderactions';

import type { Order } from '..';
import type { User } from 'next-auth';

type ProductFormProps = {
    defaultValues?: Order;
};

const gameGenres = [
    'Action', 'Adventure', 'RPG', 'Simulation', 'Strategy',
    'Sports', 'Puzzle', 'Racing', 'Horror', 'Shooter',
];

export default function ProductForm({ defaultValues }: ProductFormProps) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setFocus,
        formState: { errors, isSubmitting, isValid },
    } = useForm<Order>({
        mode: 'onChange',
        defaultValues: defaultValues || {},
    });

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        };
        fetchUser();
        setFocus('Name');
    }, [setFocus]);

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    const onSubmit = async (data: Order) => {
        try {
            const payload = { ...data, Seller: user?.username ?? 'unknown' };

            const result = defaultValues?.id
                ? await updateProduct(payload, defaultValues.id)
                : await createProduct(payload);

            if (result?.id) {
                router.push(`/product/detail/${result.id}`);
            } else {
                throw new Error('Không nhận được ID sản phẩm sau khi xử lý');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Đã xảy ra lỗi khi lưu sản phẩm.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-16 px-4">
            <motion.form
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-xl space-y-8"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    {defaultValues ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm mới'}
                </h2>

                {errorMessage && (
                    <p className="text-red-500 text-center">{errorMessage}</p>
                )}

                <FormInput
                    label="Tên sản phẩm"
                    icon={<FiTag />}
                    placeholder="Tên sản phẩm"
                    register={register('Name', { required: 'Bắt buộc' })}
                    error={errors.Name?.message}
                />

                <FormTextArea
                    label="Mô tả"
                    icon={<FiAlignLeft />}
                    placeholder="Mô tả sản phẩm"
                    register={register('Description', { required: 'Bắt buộc' })}
                    error={errors.Description?.message}
                />

                <FormInput
                    label="Giá"
                    icon={<FiDollarSign />}
                    type="number"
                    placeholder="100000"
                    register={register('Price', {
                        required: 'Bắt buộc',
                        min: { value: 0, message: 'Phải >= 0' },
                    })}
                    error={errors.Price?.message}
                />

                <FormDropdown
                    label="Thể loại"
                    icon={<FiList />}
                    options={gameGenres}
                    register={register('Category', { required: 'Bắt buộc' })}
                    error={errors.Category?.message}
                />

                <FormInput
                    label="URL hình ảnh"
                    icon={<FiImage />}
                    type="url"
                    placeholder="https://..."
                    register={register('ImageUrl', { required: 'Bắt buộc' })}
                    error={errors.ImageUrl?.message}
                />

                <FormInput
                    label="Số lượng tồn kho"
                    icon={<FiPackage />}
                    type="number"
                    placeholder="50"
                    register={register('StockQuantity', {
                        required: 'Bắt buộc',
                        min: { value: 0, message: 'Phải >= 0' },
                    })}
                    error={errors.StockQuantity?.message}
                />

                <div className="text-center">
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isSubmitting
                            ? 'Đang xử lý...'
                            : defaultValues
                                ? 'Cập nhật sản phẩm'
                                : 'Tạo sản phẩm'}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}

function FormInput({ label, icon, type = 'text', placeholder, register, error }: any) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                {icon && <span className="absolute left-3 top-3 text-gray-400">{icon}</span>}
                <input
                    type={type}
                    {...register}
                    placeholder={placeholder}
                    className="w-full pl-10 p-3 mt-1 border rounded-md focus:ring-blue-500 focus:outline-none"
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

function FormTextArea({ label, icon, placeholder, register, error }: any) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                {icon && <span className="absolute left-3 top-3 text-gray-400">{icon}</span>}
                <textarea
                    {...register}
                    placeholder={placeholder}
                    rows={4}
                    className="w-full pl-10 p-3 mt-1 border rounded-md focus:ring-blue-500 focus:outline-none resize-none"
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

function FormDropdown({ label, icon, options, register, error }: any) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                {icon && <span className="absolute left-3 top-3 text-gray-400">{icon}</span>}
                <select
                    {...register}
                    className="w-full pl-10 p-3 mt-1 border rounded-md focus:ring-blue-500 focus:outline-none"
                >
                    <option value="">-- Chọn thể loại --</option>
                    {options.map((opt: string) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
