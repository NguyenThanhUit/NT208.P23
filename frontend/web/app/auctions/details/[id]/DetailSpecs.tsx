'use client';

import { Auction } from "@/index";

type Props = {
    auction: Auction;
};

export default function DetailedSpecs({ auction }: Props) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🔍 Thông tin chi tiết của sản phẩm: </h2>

            <table className="table-auto w-full text-left border border-gray-300">
                <tbody className="text-gray-700">
                    <tr>
                        <th className="p-2 font-semibold border">Người bán</th>
                        <td className="p-2 border">{auction.seller}</td>
                    </tr>
                    <tr>
                        <th className="p-2 font-semibold border">Tên sản phẩm</th>
                        <td className="p-2 border">{auction.name}</td>
                    </tr>
                    <tr>
                        <th className="p-2 font-semibold border">Mô tả</th>
                        <td className="p-2 border">{auction.description}</td>
                    </tr>
                    <tr>
                        <th className="p-2 font-semibold border">Năm sản xuất</th>
                        <td className="p-2 border">{auction.year}</td>
                    </tr>
                    <tr>
                        <th className="p-2 font-semibold border">Có reserve price?</th>
                        <td className="p-2 border">{auction.reservePrice > 0 ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                        <th className="p-2 font-semibold border">Giá dự trữ</th>
                        <td className="p-2 border">{auction.reservePrice.toLocaleString()} VND</td>
                    </tr>
                    <tr>
                        <th className="p-2 font-semibold border">Trạng thái</th>
                        <td className="p-2 border">{auction.status}</td>
                    </tr>
                    <tr>
                        <th className="p-2 font-semibold border">Ngày kết thúc</th>
                        <td className="p-2 border">{new Date(auction.auctionEnd).toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
