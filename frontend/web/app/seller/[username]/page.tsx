"use client";

import { useEffect, useState } from "react";
import { getRateSeller } from "@/app/actions/useraction";

interface Rating {
    stars: number;
    comment: string;
    ratedAt: string;
}
interface RawRating {
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

export default function SellerPage({ params }: { params: Promise<{ username: string }> }) {
    const [seller, setSeller] = useState<SellerInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                const { username } = await params;
                const res = await getRateSeller(username);
                if (!res || !res.fullName) {
                    throw new Error("Không tìm thấy người bán hoặc dữ liệu không hợp lệ");
                }

                const sellerData: SellerInfo = {
                    fullName: res.fullName,
                    address: res.address,
                    createdAt: res.createdAt,
                    averageRating: res.averageRating ?? null,
                    ratings: (res.ratings ?? []).map((r: RawRating) => ({
                        stars: r.stars,
                        comment: r.comment,
                        ratedAt: r.ratedAt,
                    })),
                };

                setSeller(sellerData);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Đã xảy ra lỗi");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSeller();
    }, [params]);

    if (loading)
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 via-white to-blue-100">
                <p className="text-blue-700 font-semibold text-lg animate-pulse">
                    Đang tải thông tin người bán...
                </p>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 via-white to-blue-100">
                <p className="text-red-600 font-semibold text-lg">{error}</p>
            </div>
        );

    if (!seller)
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 via-white to-blue-100">
                <p className="text-gray-600 text-lg">Không tìm thấy người bán</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-extrabold text-blue-900 mb-8 border-b border-blue-300 pb-4">
                    Thông tin người bán
                </h1>

                <div className="mb-10 space-y-3 text-gray-800">
                    <p>
                        <span className="font-semibold text-blue-800">Họ và tên:</span> {seller.fullName}
                    </p>
                    <p>
                        <span className="font-semibold text-blue-800">Địa chỉ:</span> {seller.address}
                    </p>
                    <p>
                        <span className="font-semibold text-blue-800">Ngày tham gia:</span>{" "}
                        {new Date(seller.createdAt).toLocaleString("vi-VN")}
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="font-semibold text-blue-800">Đánh giá trung bình:</span>{" "}
                        {seller.averageRating !== null ? (
                            <>
                                <span className="text-yellow-500 font-bold text-xl">
                                    {seller.averageRating.toFixed(1)} / 5
                                </span>{" "}
                                <StarRating stars={seller.averageRating} />
                            </>
                        ) : (
                            <span className="italic text-gray-500">Chưa có đánh giá</span>
                        )}
                    </p>
                </div>

                <section>
                    <h2 className="text-3xl font-semibold text-blue-900 mb-6 border-b border-blue-300 pb-3">
                        Đánh giá của khách hàng gần đây
                    </h2>

                    {seller.ratings.length === 0 && (
                        <p className="italic text-gray-500 text-center py-10">Chưa có đánh giá nào.</p>
                    )}

                    <ul className="space-y-6">
                        {seller.ratings.map((rating, index) => (
                            <li
                                key={index}
                                className="border border-blue-200 rounded-lg p-5 bg-blue-50 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center mb-3 justify-between">
                                    <StarRating stars={rating.stars} />
                                    <span className="text-gray-600 text-sm italic">
                                        Ngày đánh giá: {new Date(rating.ratedAt).toLocaleDateString("vi-VN")}
                                    </span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">
                                    Bình luận: {rating.comment || <i className="text-gray-400">Không có bình luận</i>}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>

                <button
                    onClick={() => window.history.back()}
                    className="mt-12 w-full md:w-auto px-8 py-3 bg-blue-700 hover:bg-blue-800 transition-colors text-white rounded-lg font-semibold shadow-md"
                    aria-label="Quay lại trang trước"
                >
                    ← Quay lại
                </button>
            </div>
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
                <svg
                    key={`full-${i}`}
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                    <path d="M10 15l-5.878 3.09L5.88 12 1 7.91l6.06-.52L10 2l2.94 5.39 6.06.52L14.12 12l1.76 6.09z" />
                </svg>
            ))}
            {halfStar && (
                <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    role="img"
                >
                    <defs>
                        <linearGradient id="half-grad">
                            <stop offset="50%" stopColor="currentColor" />
                            <stop offset="50%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                    <path
                        fill="url(#half-grad)"
                        d="M10 15l-5.878 3.09L5.88 12 1 7.91l6.06-.52L10 2l2.94 5.39 6.06.52L14.12 12l1.76 6.09z"
                    />
                </svg>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <svg
                    key={`empty-${i}`}
                    className="w-5 h-5 text-gray-300 fill-current"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                    <path d="M10 15l-5.878 3.09L5.88 12 1 7.91l6.06-.52L10 2l2.94 5.39 6.06.52L14.12 12l1.76 6.09z" />
                </svg>
            ))}
        </div>
    );
}