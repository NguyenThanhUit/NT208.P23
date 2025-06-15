'use client';

import { rateSeller } from '@/app/actions/useraction';
import { useRouter, useParams } from 'next/navigation';
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function ReviewSellerPage() {
    const router = useRouter();
    const params = useParams();
    const username = params?.username as string;

    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        console.log("[ReviewSellerPage] Bắt đầu gửi đánh giá...");
        console.log(`[ReviewSellerPage] Username: ${username}`);
        console.log(`[ReviewSellerPage] Số sao: ${rating}`);
        console.log(`[ReviewSellerPage] Bình luận: ${comment}`);

        try {
            await rateSeller(username, {
                sellerUserName: username,
                stars: rating,
                comment,
            });

            console.log("[ReviewSellerPage] Gửi đánh giá thành công.");
            setSuccess(true);
            setTimeout(() => {
                console.log("[ReviewSellerPage] Chuyển hướng tới /order/history...");
                router.push('/order/history');
            }, 2000);
        } catch (err) {
            console.error("[ReviewSellerPage] Lỗi khi gửi đánh giá:", err);
            setError('Không thể gửi đánh giá. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">Đánh giá người bán</h1>

            {success ? (
                <p className="min-h-screen text-green-600 text-center">🎉 Cảm ơn bạn đã đánh giá!</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-xl">
                    <div>
                        <label className="block font-medium text-gray-800 mb-2">Số sao đánh giá</label>
                        <div className="flex gap-2 text-yellow-500 text-2xl">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium text-gray-800 mb-2">Bình luận</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Hãy chia sẻ trải nghiệm của bạn..."
                            required
                        />
                    </div>

                    {error && <p className="text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={submitting || rating === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                    </button>
                </form>
            )}
        </div>
    );
}
