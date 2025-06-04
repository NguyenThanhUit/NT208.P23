"use client";

import { useEffect, useState } from "react";
import { getRateSeller } from "@/app/actions/useraction";

interface Rating {
    stars: number;
    comment: string;
    ratedAt: string;
}

interface SellerInfo {
    fullName: string;
    address: string;
    createdAt: string;
    averageRating: number | null;
    ratings: Rating[];
}

export default function SellerPage({ params }: { params: { username: string } }) {
    const { username } = params;
    const [seller, setSeller] = useState<SellerInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const res = await getRateSeller(username);
                console.log("Thông tin người bán và đánh giá", res);

                if (!res || !res.fullName) {
                    throw new Error("Không tìm thấy người bán hoặc dữ liệu không hợp lệ");
                }

                const sellerData: SellerInfo = {
                    fullName: res.fullName,
                    address: res.address,
                    createdAt: res.createdAt,
                    averageRating: res.averageRating ?? null,
                    ratings: (res.ratings ?? []).map((r: any) => ({
                        stars: r.stars,
                        comment: r.comment,
                        ratedAt: r.ratedAt,
                    })),
                };

                setSeller(sellerData);
            } catch (err: any) {
                setError(err.message || "Đã xảy ra lỗi");
            } finally {
                setLoading(false);
            }
        };

        fetchSeller();
    }, [username]);

    if (loading) return <div className="min-h-screen flex justify-center items-center">Đang tải thông tin người bán...</div>;
    if (error) return <div className="min-h-screen text-red-500 flex justify-center items-center">{error}</div>;
    if (!seller) return <div className="min-h-screen flex justify-center items-center">Không tìm thấy người bán</div>;

    return (
        <div className="min-h-screen max-w-4xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-6 border-b pb-3">Thông tin người bán</h1>

            <div className="mb-8 space-y-2">
                <p><strong>Họ và tên:</strong> {seller.fullName}</p>
                <p><strong>Địa chỉ:</strong> {seller.address}</p>
                <p><strong>Ngày tham gia:</strong> {new Date(seller.createdAt).toLocaleString("vi-VN")}</p>
                <p><strong>Đánh giá trung bình:</strong> {seller.averageRating !== null ? seller.averageRating.toFixed(1) + " / 5 ⭐" : "Chưa có đánh giá"}</p>
            </div>

            <section>
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Đánh giá của khách hàng gần đây</h2>

                {seller.ratings.length === 0 && (
                    <p className="italic text-gray-500">Chưa có đánh giá nào.</p>
                )}

                <ul className="space-y-6">
                    {seller.ratings.map((rating, index) => (
                        <li
                            key={index}
                            className="border rounded p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center mb-2">
                                <StarRating stars={rating.stars} />
                                <span className="ml-3 text-gray-600 text-sm italic">
                                    {new Date(rating.ratedAt).toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                            <p className="text-gray-700"> Bình luận: {rating.comment || <i>Không có bình luận</i>}</p>
                        </li>
                    ))}
                </ul>
            </section>

            <button
                onClick={() => window.history.back()}
                className="mt-10 px-5 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
                ← Quay lại
            </button>
        </div>
    );
}


function StarRating({ stars }: { stars: number }) {
    const fullStars = Math.floor(stars);
    const halfStar = stars - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex text-yellow-400">
            {[...Array(fullStars)].map((_, i) => (
                <svg key={`full-${i}`} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09L5.88 12 1 7.91l6.06-.52L10 2l2.94 5.39 6.06.52L14.12 12l1.76 6.09z" />
                </svg>
            ))}
            {halfStar && (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <defs>
                        <linearGradient id="half-grad">
                            <stop offset="50%" stopColor="currentColor" />
                            <stop offset="50%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#half-grad)" d="M10 15l-5.878 3.09L5.88 12 1 7.91l6.06-.52L10 2l2.94 5.39 6.06.52L14.12 12l1.76 6.09z" />
                </svg>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09L5.88 12 1 7.91l6.06-.52L10 2l2.94 5.39 6.06.52L14.12 12l1.76 6.09z" />
                </svg>
            ))}
        </div>
    );
}
