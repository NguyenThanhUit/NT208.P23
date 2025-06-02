'use client'

import { placeBidForAuction } from "@/app/actions/auctionaction"
import { useBidStore } from "@/hooks/useBidStore"
import { FieldValues, useForm } from "react-hook-form"
import toast from "react-hot-toast"

type Props = {
    auctionId: string
    highBid: number
}

export default function BidForm({ auctionId, highBid }: Props) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const addBid = useBidStore(state => state.addBid);

    const MIN_INCREMENT = 10000;
    const minBid = highBid + MIN_INCREMENT;

    function onSubmit(data: FieldValues) {
        const bidAmount = +data.amount;

        if (bidAmount < minBid) {
            reset();
            return toast.error(`Giá tối thiểu là ${minBid.toLocaleString()} VND`);
        }

        placeBidForAuction(auctionId, bidAmount)
            .then(bid => {
                if (bid.error) throw bid.error;
                addBid(bid);
                reset();
            })
            .catch(err => {
                console.error(err);
                toast.error(err.message);
            });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center border border-gray-300 rounded-lg px-4 py-2 gap-3 shadow-sm bg-white">
            <input
                type="number"
                {...register('amount')}
                className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md px-3 py-2 border border-gray-300"
                placeholder={`Nhập giá đấu ≥ ${minBid.toLocaleString()} VND`}
                min={minBid}
                step={1000}
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-md transition duration-200"
            >
                Đặt giá
            </button>
        </form>

    );
}
