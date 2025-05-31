import { Bid } from "@/index";
import { format } from "date-fns";

type Props = {
    bid: Bid;
};

export default function BidItem({ bid }: Props) {
    function getBidInfo() {
        let bgColor = '';
        let text = '';
        switch (bid.bidStatus) {
            case 'Accepted':
                bgColor = 'bg-green-100 text-green-800';
                text = 'Đấu giá hợp lệ';
                break;
            case 'AcceptedBelowReserve':
                bgColor = 'bg-yellow-100 text-yellow-800';
                text = 'Chưa đạt giá khởi điểm';
                break;
            case 'TooLow':
                bgColor = 'bg-red-100 text-red-800';
                text = 'Giá đưa ra quá thấp';
                break;
            default:
                bgColor = 'bg-gray-200 text-gray-800';
                text = 'Đặt giá sau khi kết thúc';
                break;
        }
        return { bgColor, text };
    }

    const { bgColor, text } = getBidInfo();

    return (
        <div className={`border px-4 py-3 rounded-xl shadow-sm mb-3 ${bgColor} transition`}>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                        Người đấu giá: <span className="font-semibold">{bid.bidder}</span>
                    </span>
                    <span className="text-sm text-gray-600">
                        Thời gian: {format(new Date(bid.bidTime), "dd/MM/yyyy HH:mm")}
                    </span>
                </div>
                <div className="text-right">
                    <div className="text-lg font-bold text-black">
                        {bid.amount.toLocaleString()} VND
                    </div>
                    <div className="text-sm mt-1 font-medium">
                        {text}
                    </div>
                </div>
            </div>
        </div>
    );
}
