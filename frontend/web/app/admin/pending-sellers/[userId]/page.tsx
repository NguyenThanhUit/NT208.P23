'use client';
import Image from "next/image";
import { getUserInformation, getSellerDetail, approveUser, rejectUser } from "@/app/actions/useraction";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SellerDetail {
    userId: string;
    fullName: string;
    address: string;
    idCardNumber: string;
    idCardImageUrl: string;
    bankAccount: string;
    verificationStatus: string;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
    role: string;
}

export default function SellerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params?.userId as string | undefined;

    const [seller, setSeller] = useState<SellerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        async function checkAndFetch() {
            try {
                const userInfo = await getUserInformation();

                if (userInfo?.role !== "admin") {
                    alert("Bạn không có quyền truy cập trang này.");
                    router.push("/");
                    return;
                }

                if (userId) {
                    const data = await getSellerDetail(userId);
                    if (!data) {
                        alert("Không tìm thấy dữ liệu seller cho userId này.");
                    }
                    setSeller(data);
                } else {
                    alert("Không có userId để hiển thị.");
                }
            } catch {
                alert("Đã có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        }

        checkAndFetch();
    }, [userId, router]);

    async function handleApprove() {
        if (!seller || !userId) return;
        setProcessing(true);
        try {
            await approveUser(userId, {});
            alert("Duyệt seller thành công!");
            router.push("/admin/pending-sellers");
        } catch {
            alert("Duyệt seller thất bại.");
        } finally {
            setProcessing(false);
        }
    }

    async function handleReject() {
        if (!seller || !userId) return;
        setProcessing(true);
        try {
            await rejectUser(userId, {});
            alert("Từ chối seller thành công!");
            router.push("/admin/pending-sellers");
        } catch {
            alert("Từ chối seller thất bại.");
        } finally {
            setProcessing(false);
        }
    }

    if (loading) return <p className="p-6 text-center">Đang tải thông tin seller...</p>;
    if (!userId) return <p className="p-6 text-center">Không có userId để hiển thị.</p>;
    if (!seller) return <p className="p-6 text-center">Không tìm thấy seller.</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Chi tiết Seller chờ duyệt</h1>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                    <p><strong>Họ và tên:</strong> {seller.fullName}</p>
                    <p><strong>Địa chỉ:</strong> {seller.address}</p>
                    <p><strong>Số CMND:</strong> {seller.idCardNumber}</p>
                    <p><strong>Số tài khoản:</strong> {seller.bankAccount}</p>
                    <p>
                        <strong>Trạng thái xác thực:</strong>
                        <span className={`font-semibold ml-2 ${seller.verificationStatus === "pending" ? "text-yellow-600"
                            : seller.verificationStatus === "approved" ? "text-green-600"
                                : "text-red-600"
                            }`}>
                            {seller.verificationStatus === "pending" ? "Chờ duyệt"
                                : seller.verificationStatus === "approved" ? "Đã duyệt"
                                    : "Bị từ chối"}
                        </span>
                    </p>
                    <p><strong>Ngày tạo:</strong> {new Date(seller.createdAt).toLocaleString()}</p>
                    <p><strong>Ngày cập nhật:</strong> {new Date(seller.updatedAt).toLocaleString()}</p>
                </div>

                <div className="flex-1">
                    <p className="font-semibold mb-2">Ảnh CMND / CCCD:</p>
                    <div className="border rounded overflow-hidden shadow-sm">
                        <Image
                            src={seller.idCardImageUrl}
                            alt="Ảnh CMND"
                            width={500}
                            height={300}
                            className="w-full h-auto object-contain max-h-64"
                            priority={false}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                    disabled={processing || seller.verificationStatus !== "pending"}
                    onClick={handleApprove}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
                >
                    Duyệt
                </button>
                <button
                    disabled={processing || seller.verificationStatus !== "pending"}
                    onClick={handleReject}
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition"
                >
                    Từ chối
                </button>
                <button
                    onClick={() => router.push("/admin/pending-sellers")}
                    className="bg-gray-400 text-black px-6 py-2 rounded hover:bg-gray-500 transition"
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
}
