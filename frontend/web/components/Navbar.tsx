"use client";

import { getCurrentUser } from "@/app/actions/authactions";
import UserLogged from "./UserLogged";
import LoginButton from "./LoginButton";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useCartStore } from "@/app/function/cartStore";
import { usePathname, useRouter } from "next/navigation";

interface User {
    id?: string;
    username: string;
    email?: string | null;

}


export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const totalQuantity = useCartStore((state) => state.getTotalQuantity());

    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser ?? null);
            } catch (err) {
                console.error("Lỗi khi lấy thông tin người dùng:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogoClick = () => {
        router.push("/");
    };

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 shadow-md">
            <div
                className="cursor-pointer flex items-center gap-2 text-3xl font-semibold text-red-500"
                onClick={handleLogoClick}
            >
                <div>E-Shop</div>
            </div>

            <div className="flex gap-4 pl-80">
                <Link href="/">
                    <button
                        className={`px-4 py-2 border rounded-md ${pathName === "/"
                            ? "border-red-500 text-red-600 font-semibold"
                            : "border-gray-300 text-gray-800 hover:bg-gray-100"
                            }`}
                    >
                        Sản phẩm
                    </button>
                </Link>
                <Link href="/auctions">
                    <button
                        className={`px-4 py-2 border rounded-md ${pathName.startsWith("/auctions")
                            ? "border-red-500 text-red-600 font-semibold"
                            : "border-gray-300 text-gray-800 hover:bg-gray-100"
                            }`}
                    >
                        Đấu giá
                    </button>
                </Link>
                <Link href="/trending">
                    <button
                        className={`px-4 py-2 border rounded-md ${pathName.startsWith("/trending")
                            ? "border-red-500 text-red-600 font-semibold"
                            : "border-gray-300 text-gray-800 hover:bg-gray-100"
                            }`}
                    >
                        Xếp hạng
                    </button>
                </Link>
                <Link href="/blog">
                    <button
                        className={`px-4 py-2 border rounded-md ${pathName.startsWith("/blog")
                            ? "border-red-500 text-red-600 font-semibold"
                            : "border-gray-300 text-gray-800 hover:bg-gray-100"
                            }`}
                    >
                        Blog
                    </button>
                </Link>
                <Link href="/support">
                    <button
                        className={`px-4 py-2 border rounded-md ${pathName.startsWith("/support")
                            ? "border-red-500 text-red-600 font-semibold"
                            : "border-gray-300 text-gray-800 hover:bg-gray-100"
                            }`}
                    >
                        Hỗ trợ
                    </button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {user && !loading && (
                    <Link href={`/order/cart/`}>
                        <div className="relative cursor-pointer">
                            <FiShoppingCart className="text-2xl text-gray-700 hover:text-gray-900" />
                            {totalQuantity > 0 && (
                                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                                    {totalQuantity}
                                </span>
                            )}
                        </div>
                    </Link>
                )}

                {loading ? (
                    <div className="text-gray-500">Đang tải...</div>
                ) : user ? (
                    <UserLogged user={user} />
                ) : (
                    <LoginButton />
                )}
            </div>
        </header>
    );
}
