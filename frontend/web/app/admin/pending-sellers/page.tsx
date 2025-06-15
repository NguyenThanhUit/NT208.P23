'use client';

import { useEffect, useState } from "react";
import { getUserInformation, listUsermakeSeller } from "@/app/actions/useraction";
import { useRouter } from "next/navigation";

interface PendingSeller {
    userId: string;
    fullName: string;
    createdAt: string;
    email?: string;
}

export default function PendingSellerPage() {
    const [pendingSellers, setPendingSellers] = useState<PendingSeller[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchPending() {
            try {
                const response = await getUserInformation();
                console.log("Thông tin user:", response);

                if (response?.role === "admin") {
                    const sellers = await listUsermakeSeller();
                    console.log("Kết quả từ listUsermakeSeller:", sellers);

                    if (Array.isArray(sellers)) {
                        setPendingSellers(sellers);
                    } else {
                        console.error("Lỗi khi lấy sellers:", sellers?.error);
                        alert("Không thể tải danh sách seller. Có thể bạn không có quyền.");
                    }
                } else {
                    alert("Bạn không có quyền truy cập trang này.");
                    router.push("/");
                }
            } catch (err) {
                console.error("Lỗi khi lấy danh sách seller:", err);
                alert("Đã có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        }

        fetchPending();
    }, [router]);

    function handleReviewSeller(userId: string) {
        router.push(`/admin/pending-sellers/${userId}`);
    }

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <h1 className="text-2xl font-bold mb-4">Danh sách Seller chờ duyệt</h1>

            {loading ? (
                <p className="min-h-screen">Đang tải...</p>
            ) : pendingSellers.length === 0 ? (
                <p>Không có người dùng nào đang chờ duyệt.</p>
            ) : (
                <div className="grid gap-4">
                    {pendingSellers.map((seller) => (
                        <div
                            key={seller.userId}
                            className="border border-gray-300 p-4 rounded-lg shadow hover:shadow-md transition"
                        >
                            <h2 className="font-semibold text-lg">{seller.fullName}</h2>
                            <p>Id người đăng kí: {seller.userId ?? "Chưa có email"}</p>
                            <p>Ngày đăng ký: {new Date(seller.createdAt).toLocaleDateString()}</p>
                            <button
                                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={() => handleReviewSeller(seller.userId)}
                            >
                                Xem và duyệt
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
