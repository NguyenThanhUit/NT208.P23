'use client';

import { getCurrentUser } from "@/app/actions/authactions";
import { useEffect, useState } from "react";
import { User, Mail, Phone, Wallet } from "lucide-react";

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

    const normalizeUser = (rawUser: any): CustomUser => ({
        id: rawUser.id ?? "unknown",
        name: rawUser.name ?? null,
        email: rawUser.email ?? null,
        image: rawUser.image ?? null,
        phoneNumber: rawUser.phoneNumber ?? null,
        walletBalance: rawUser.walletBalance ?? 0,
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    setUser(normalizeUser(currentUser));
                }
            } catch (err) {
                console.error("Lỗi khi lấy thông tin user:", err);
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
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-5xl p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Avatar và tên */}
                    <div className="flex flex-col items-center">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt="Avatar"
                                className="w-36 h-36 rounded-full border-4 border-white shadow-md mb-4"
                            />
                        ) : (
                            <div className="w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-white mb-4">
                                ?
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-800">{user.name || "Không có tên"}</h2>
                        <p className="text-gray-500">{user.email || "Không có email"}</p>
                    </div>

                    {/* Chi tiết */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
                        <InfoRow icon={<User className="w-5 h-5" />} label="ID người dùng" value={user.id} />
                        <InfoRow icon={<Phone className="w-5 h-5" />} label="Số điện thoại" value={user.phoneNumber ?? "Không có"} />
                        <InfoRow icon={<Mail className="w-5 h-5" />} label="Email" value={user.email ?? "Không có"} />
                        <InfoRow
                            icon={<Wallet className="w-5 h-5" />}
                            label="Số dư ví"
                            value={`${user.walletBalance?.toLocaleString() ?? "0"} đ`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="text-indigo-500 mt-1">{icon}</div>
            <div>
                <div className="text-xs font-semibold text-gray-500">{label}</div>
                <div className="text-sm font-medium">{value}</div>
            </div>
        </div>
    );
}
