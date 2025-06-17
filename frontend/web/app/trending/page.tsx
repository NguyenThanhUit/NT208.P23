'use client';

import React, { useEffect, useState } from 'react';

import { FaStar, FaMapMarkerAlt, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import moment from 'moment';
import { getSellerRank } from '../actions/useraction';

type Seller = {
    userName: string;
    fullName: string;
    averageRating: number;
    totalRatings: number;
    address: string;
    createdAt: string;
};

export default function SellerRanking() {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const data = await getSellerRank();
                if (data) setSellers(data);
            } catch (error) {
                console.error('Lỗi lấy danh sách người bán:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    if (loading) return <p className="min-h-screen text-center py-10">⏳ Đang tải bảng xếp hạng...</p>;
    if (sellers.length === 0) return <p className="min-h-screen text-center py-10">📭 Chưa có người bán nào được xếp hạng.</p>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className=" text-4xl font-extrabold text-center mb-10 text-blue-700">🏆 Bảng xếp hạng người bán</h1>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {sellers.map((seller, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all border border-gray-200"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <FaUserCircle className="text-5xl text-blue-500" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    {seller.fullName}
                                    <FaCheckCircle className="text-green-500" title="Đã xác minh" />
                                </h2>
                                <p className="text-sm text-gray-500">@{seller.userName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-yellow-500 mb-1">
                            {[...Array(Math.round(seller.averageRating))].map((_, i) => (
                                <FaStar key={i} />
                            ))}
                            <span className="text-gray-700 font-medium ml-2">
                                {seller.averageRating.toFixed(2)} ({seller.totalRatings} đánh giá)
                            </span>
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                            <FaMapMarkerAlt /> {seller.address}
                        </div>
                        <p className="text-xs text-gray-400">
                            🕒 Tham gia từ {moment(seller.createdAt).format('DD/MM/YYYY')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
