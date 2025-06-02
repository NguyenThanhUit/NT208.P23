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
    const { control, handleSubmit, setFocus, reset, formState: { isSubmitting, isValid } } = useForm({
        mode: 'onTouched',
    });

    useEffect(() => {
        if (auction) {
            const { make, model, color, mileage, year, key } = auction;
            reset({ make, model, color, mileage, year, key });
        }
        setFocus('make');
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
                toast.error('An unexpected error occurred.');
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-lg space-y-8"
            >
                <h2 className="text-3xl font-extrabold text-center text-gray-800">
                    {pathname === '/auctions/create' ? 'Create New Auction' : 'Update Auction'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Make" name="make" control={control} rules={{ required: 'Make is required' }} />
                    <Input label="Model" name="model" control={control} rules={{ required: 'Model is required' }} />
                    <Input label="Color" name="color" control={control} rules={{ required: 'Color is required' }} />
                    <Input label="Key" name="key" control={control} rules={{ required: 'Key is required' }} />
                    <Input
                        label="Year"
                        name="year"
                        type="number"
                        control={control}
                        rules={{ required: 'Year is required' }}
                    />
                    <Input
                        label="Mileage"
                        name="mileage"
                        control={control}
                        rules={{ required: 'Mileage is required' }}
                    />
                </div>

                {pathname === '/auctions/create' && (
                    <>
                        <Input
                            label="Image URL"
                            name="imageUrl"
                            control={control}
                            rules={{ required: 'Image URL is required' }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Reserve Price (optional)"
                                name="reservePrice"
                                type="number"
                                control={control}
                            />
                            <DateInput
                                label="Auction End Date/Time"
                                name="auctionEnd"
                                dateFormat="dd MMMM yyyy h:mm a"
                                showTimeSelect
                                control={control}
                                rules={{ required: 'Auction end date is required' }}
                            />
                        </div>
                    </>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t pt-6">
                    <Button
                        outline
                        color="gray"
                        type="button"
                        onClick={() => router.back()}
                        className="w-full md:w-auto"
                    >
                        ← Cancel
                    </Button>
                    <Button
                        isProcessing={isSubmitting}
                        disabled={!isValid}
                        outline
                        color="success"
                        type="submit"
                        className="w-full md:w-auto"
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </div>

    );
}
