'use client'
import { Button } from 'flowbite-react';
import React, { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { usePathname, useRouter } from 'next/navigation';
import { Auction } from '..';
import { createAuction, updateAuction } from '@/app/actions/auctionaction';
import { toast } from 'react-toastify';
import Input from './Input';
import DateInput from './DateInput';

type Props = {
    auction?: Auction;
};

export default function AuctionForm({ auction }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const {
        control,
        handleSubmit,
        setFocus,
        reset,
        formState: { isSubmitting, isValid }
    } = useForm({
        mode: 'onTouched',
    });

    useEffect(() => {
        if (auction) {
            const { name, description, category, year, key } = auction;
            reset({ name, description, category, year, key });
        }
        setFocus('name');
    }, [setFocus, auction, reset]);

    async function onSubmit(data: FieldValues) {
        try {
            let id = '';
            let res;
            if (pathname === '/auctions/create') {
                res = await createAuction(data);
                id = res.id;
            } else if (auction) {
                res = await updateAuction(data, auction.id);
                id = auction.id;
            }

            if (res.error) throw res.error;

            router.push(`/auctions/details/${id}`);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'status' in error && 'message' in error) {
                const { status, message } = error as { status: number; message: string };
                toast.error(`${status} ${message}`);
            } else {
                toast.error('Đã xảy ra lỗi không mong muốn.');
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6 py-12">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-4xl bg-white p-12 rounded-3xl shadow-2xl space-y-8 transition-all duration-500"
            >
                <h2 className="text-4xl font-bold text-center text-gray-800 relative mb-6">
                    {pathname === '/auctions/create' ? '🛒 Tạo đấu giá mới' : '✏️ Cập nhật đấu giá'}
                    <div className="w-20 h-1 bg-green-500 mx-auto mt-3 rounded-full"></div>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input
                        label="🎮 Tên game"
                        name="name"
                        control={control}
                        rules={{ required: 'Tên game là bắt buộc' }}
                    />
                    <Input
                        label="📝 Mô tả"
                        name="description"
                        control={control}
                        rules={{ required: 'Mô tả là bắt buộc' }}
                    />
                    <Input
                        label="📂 Thể loại"
                        name="category"
                        control={control}
                        rules={{ required: 'Thể loại là bắt buộc' }}
                    />
                    <Input
                        label="🔑 Key"
                        name="key"
                        control={control}
                        rules={{ required: 'Key là bắt buộc' }}
                    />
                    <Input
                        label="📅 Năm sản xuất"
                        name="year"
                        type="number"
                        control={control}
                        rules={{ required: 'Năm sản xuất là bắt buộc' }}
                    />
                </div>

                {pathname === '/auctions/create' && (
                    <>
                        <Input
                            label="🖼️ URL hình ảnh"
                            name="imageUrl"
                            control={control}
                            rules={{
                                required: 'URL hình ảnh là bắt buộc',
                                pattern: {
                                    value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i,
                                    message: 'URL hình ảnh không hợp lệ (phải là link ảnh hợp lệ)',
                                },
                            }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                label="💰 Giá dự kiến (tuỳ chọn)"
                                name="reservePrice"
                                type="number"
                                control={control}
                                rules={{
                                    validate: (value) =>
                                        value === undefined || value === null || value === ''
                                            ? true
                                            : parseInt(value) > 10000 || 'Giá phải lớn hơn 10,000 đồng',
                                }}
                            />
                            <DateInput
                                label="⏰ Ngày giờ kết thúc đấu giá"
                                name="auctionEnd"
                                dateFormat="dd MMMM yyyy h:mm a"
                                showTimeSelect
                                control={control}
                                rules={{ required: 'Ngày kết thúc là bắt buộc' }}
                            />
                        </div>
                    </>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6">
                    <Button
                        outline
                        color="gray"
                        type="button"
                        onClick={() => router.back()}
                        className="w-full md:w-auto hover:scale-105 transition-transform duration-200"
                    >
                        ❌ Hủy
                    </Button>
                    <Button
                        isProcessing={isSubmitting}
                        disabled={!isValid}
                        outline
                        color="success"
                        type="submit"
                        className="w-full md:w-auto hover:scale-105 transition-transform duration-200"
                    >
                        🚀 Gửi
                    </Button>
                </div>
            </form>
        </div>
    );
}
