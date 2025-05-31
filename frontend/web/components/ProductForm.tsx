'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/app/actions/orderactions';
import { getCurrentUser } from '@/app/actions/authactions';
import type { Order } from '..';
import type { User } from 'next-auth';
import { motion } from 'framer-motion';
import {
    FiTag,
    FiDollarSign,
    FiPackage,
    FiImage,
    FiList,
    FiAlignLeft
} from 'react-icons/fi';

const gameGenres = [
    'Action',
    'Adventure',
    'RPG',
    'Simulation',
    'Strategy',
    'Sports',
    'Puzzle',
    'Racing',
    'Horror',
    'Shooter'
];

export default function ProductForm() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors, isSubmitting, isValid }
    } = useForm<Order>({
        mode: 'onChange'
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                console.error('Lỗi khi lấy thông tin người dùng:', err);
            }
        };

        loadUser();
        setFocus('Name');
    }, [setFocus]);

    const onSubmit = async (data: Order) => {
        try {
            const productData = {
                ...data,
                Seller: user?.username || 'unknown'
            };

            const response = await createProduct(productData);

            if (response?.id) {
                router.push(`/Product/Detail/${response.id}`);
            } else {
                throw new Error('Không nhận được ID sau khi tạo.');
            }
        } catch (error) {
            console.error('Lỗi khi tạo sản phẩm:', error);
            setErrorMessage('Không thể tạo sản phẩm. Vui lòng thử lại.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-16 px-4">
            <motion.form
                onSubmit={handleSubmit(onSubmit)}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl p-10 space-y-8"
            >
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
                    Tạo sản phẩm mới
                </h2>

                {errorMessage && (
                    <p className="text-center text-red-600 font-medium">{errorMessage}</p>
                )}

                <FormInput
                    icon={<FiTag />}
                    label="Tên sản phẩm"
                    type="text"
                    placeholder="Nhập tên sản phẩm"
                    register={register('Name', { required: 'Tên sản phẩm là bắt buộc' })}
                    error={errors.Name?.message}
                />

                <FormTextArea
                    icon={<FiAlignLeft />}
                    label="Mô tả"
                    placeholder="Nhập mô tả sản phẩm"
                    register={register('Description', { required: 'Mô tả là bắt buộc' })}
                    error={errors.Description?.message}
                />

                <FormInput
                    icon={<FiDollarSign />}
                    label="Giá"
                    type="number"
                    placeholder="Nhập giá sản phẩm"
                    register={register('Price', {
                        required: 'Giá là bắt buộc',
                        min: { value: 0, message: 'Giá phải lớn hơn hoặc bằng 0' }
                    })}
                    error={errors.Price?.message}
                />

                <FormDropdown
                    icon={<FiList />}
                    label="Thể loại"
                    options={gameGenres}
                    register={register('Category', { required: 'Vui lòng chọn thể loại' })}
                    error={errors.Category?.message}
                />

                <FormInput
                    icon={<FiImage />}
                    label="URL hình ảnh"
                    type="url"
                    placeholder="Nhập URL hình ảnh"
                    register={register('ImageUrl', { required: 'URL hình ảnh là bắt buộc' })}
                    error={errors.ImageUrl?.message}
                />

                <FormInput
                    icon={<FiPackage />}
                    label="Số lượng tồn kho"
                    type="number"
                    placeholder="Nhập số lượng tồn kho"
                    register={register('StockQuantity', {
                        required: 'Số lượng tồn kho là bắt buộc',
                        min: { value: 0, message: 'Số lượng phải >= 0' }
                    })}
                    error={errors.StockQuantity?.message}
                />

                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center space-x-3"
                    >
                        {isSubmitting && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                ></path>
                            </svg>
                        )}
                        <span>{isSubmitting ? 'Đang xử lý...' : 'Tạo sản phẩm'}</span>
                    </button>
                </div>
            </motion.form>
        </div>
    );
}


function FormInput({
    label,
    icon,
    type = 'text',
    placeholder,
    register,
    error
}: {
    label: string;
    icon?: React.ReactNode;
    type?: string;
    placeholder: string;
    register: any;
    error?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    {...register}
                    placeholder={placeholder}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm hover:shadow-md"
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}


function FormTextArea({
    label,
    icon,
    placeholder,
    register,
    error
}: {
    label: string;
    icon?: React.ReactNode;
    placeholder: string;
    register: any;
    error?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                        {icon}
                    </span>
                )}
                <textarea
                    {...register}
                    placeholder={placeholder}
                    rows={4}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm hover:shadow-md resize-none"
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

function FormDropdown({
    label,
    icon,
    options,
    register,
    error
}: {
    label: string;
    icon?: React.ReactNode;
    options: string[];
    register: any;
    error?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-3.5 text-gray-400 pointer-events-none">
                        {icon}
                    </span>
                )}
                <select
                    {...register}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm hover:shadow-md"
                >
                    <option value="">-- Chọn thể loại --</option>
                    {options.map((opt) => (
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
