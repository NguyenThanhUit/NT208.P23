'use client';

import { getCurrentUser } from "@/app/actions/authactions";
import { useEffect, useState } from "react";

// Định nghĩa kiểu dữ liệu user
interface CustomUser {
    id: string;
    name: string | null;
    email: string | null;
    image?: string | null;
    phoneNumber?: string | null;
    walletBalance?: number;
}

export default function AccountDetailPage() {
    const [user, setUser] = useState<CustomUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Chuẩn hóa dữ liệu nhận được về đúng kiểu CustomUser
    const normalizeUser = (rawUser: any): CustomUser => {
        return {
            id: rawUser.id ?? "unknown",
            name: rawUser.name ?? null,
            email: rawUser.email ?? null,
            image: rawUser.image ?? null,
            phoneNumber: rawUser.phoneNumber ?? null,
            walletBalance: rawUser.walletBalance ?? 0,
        };
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                console.log("Raw user data from getCurrentUser:", currentUser);

                if (currentUser) {
                    const safeUser = normalizeUser(currentUser);
                    console.log("Normalized user data:", safeUser);
                    setUser(safeUser);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Lỗi khi lấy thông tin user:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
                <div className="text-lg font-semibold text-gray-600">
                    Đang tải thông tin người dùng...
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-100 to-pink-200">
                <div className="text-lg font-semibold text-red-600">
                    Không thể lấy thông tin người dùng.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6">
                <div className="flex flex-col items-center">
                    {user.image && (
                        <img
                            src={user.image}
                            alt="Avatar"
                            className="w-28 h-28 rounded-full border-4 border-white shadow-md mb-4"
                        />
                    )}
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        {user.name || "Không có tên"}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {user.email || "Không có email"}
                    </p>
                </div>

                <div className="mt-6 border-t pt-4 text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium">ID người dùng:</span>
                        <span>{user.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Số điện thoại:</span>
                        <span>{user.phoneNumber ?? "Không có"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Số dư ví:</span>
                        <span>{user.walletBalance?.toLocaleString() ?? "0"} đ</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-center">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md transition">
                        Chỉnh sửa thông tin
                    </button>
                </div>
            </div>
        </div>
    );
}
