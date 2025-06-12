'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { User, Mail, Home, Wallet } from "lucide-react";
import { getCurrentUser } from "@/app/actions/authactions";
import { getProductForSeller } from "@/app/actions/orderactions";

interface CustomUser {
    id: string;
    name: string | null;
    email: string | null;
    image?: string | null;
    address?: string | null;
    walletBalance?: number;
    createdAt: string;
    username: string;
}

interface Product {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    soldAmount: number;
    status: string;
}

export default function AccountDetailPage() {
    const [user, setUser] = useState<CustomUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

    const normalizeUser = (rawUser: Partial<CustomUser>): CustomUser => ({
        id: rawUser.id ?? "unknown",
        name: rawUser.name ?? null,
        email: rawUser.email ?? null,
        image: rawUser.image ?? null,
        address: rawUser.address ?? null,
        createdAt: rawUser.createdAt ?? new Date().toISOString(),
        walletBalance: rawUser.walletBalance ?? 0,
        username: rawUser.username ?? "unknown",
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

    useEffect(() => {
        const loadProducts = async () => {
            if (user?.username) {
                try {
                    const res = await getProductForSeller(user.username);
                    console.log("📦 Dữ liệu sản phẩm trả về:", res);
                    setProducts(res || []);
                } catch (err) {
                    console.error("Lỗi khi lấy sản phẩm:", err);
                }
            }
        };
        loadProducts();
    }, [user]);

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
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-6xl p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt="Avatar"
                                width={144}
                                height={144}
                                className="rounded-full border-4 border-white shadow-md mb-4 object-cover"
                            />
                        ) : (
                            <div className="w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-white mb-4">
                                ?
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-800">{user.name || "Không có tên"}</h2>
                        <p className="text-gray-500">{user.email || "Không có email"}</p>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
                        <InfoRow icon={<User className="w-5 h-5" />} label="Thời gian tạo tài khoản" value={new Date(user.createdAt).toLocaleString('vi-VN')} />
                        <InfoRow icon={<Home className="w-5 h-5" />} label="Địa chỉ" value={user.address ?? "Không có"} />
                        <InfoRow icon={<Mail className="w-5 h-5" />} label="Email" value={user.email ?? "Không có"} />
                        <InfoRow icon={<Wallet className="w-5 h-5" />} label="Số dư ví" value={`${user.walletBalance?.toLocaleString('vi-VN')} đ`} />
                    </div>
                </div>

                <div className="mt-10">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Danh sách sản phẩm</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((product, index) => (
                            <div key={index} className="bg-white border rounded-lg shadow p-4">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-40 object-cover rounded mb-2"
                                />
                                <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                <p className="text-sm text-gray-500">{product.description}</p>
                                <p className="text-indigo-600 font-medium mt-1">
                                    {product.price.toLocaleString('vi-VN')} đ
                                </p>

                                <span
                                    className={`inline-block px-2 py-1 mt-2 text-xs font-semibold rounded ${product.status === 'Completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                >
                                    {product.status === 'Completed' ? 'Đã bán' : 'Chưa bán được'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
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
