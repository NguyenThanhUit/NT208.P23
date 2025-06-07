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
    const { register, handleSubmit, reset } = useForm();
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center border-2 rounded-lg py-2 px-3 gap-2">
            <input
                type="number"
                {...register('amount')}
                className="input-custom text-sm text-gray-600 w-full"
                placeholder={`Nhập giá đấu ≥ ${minBid.toLocaleString()} VND`}
                min={minBid}
                step={1000}
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                Đặt giá
            </button>
        </form>
    );
}
