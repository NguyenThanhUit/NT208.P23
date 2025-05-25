'use client';

import { getCurrentUser } from "@/app/actions/authactions";
import UserLogged from "./UserLogged";
import LoginButton from "./LoginButton";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useCartStore } from "@/app/function/cartStore";
import { Order } from "..";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "flowbite-react";

export default function Navbar({ orders }: { orders: Order[] }) {
    const [user, setUser] = useState<any>(null);
    const totalQuantity = useCartStore((state) => state.getTotalQuantity());

    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        getCurrentUser().then(setUser);
    }, []);

    const handleLogoClick = () => {
        router.push("/");
    };

    const handleAuctionClick = () => {
        router.push("/auction");
    };

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 shadow-md">
            {/* Logo */}
            <div
                className='cursor-pointer flex items-center gap-2 text-3xl font-semibold text-red-500'
                onClick={handleLogoClick}
            >
                <div>E-Shop</div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pl-80">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-800 hover:bg-gray-100">
                    Sản phẩm
                </button>
                <button
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-800 hover:bg-gray-100"
                    onClick={handleAuctionClick}
                >
                    Đấu giá
                </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {/* Cart Icon */}
                <Link href={`/Order/Cart/`}>
                    <div className="relative cursor-pointer">
                        <FiShoppingCart className="text-2xl text-gray-700 hover:text-gray-900" />
                        {totalQuantity > 0 && (
                            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                                {totalQuantity}
                            </span>
                        )}
                    </div>
                </Link>

                {/* User */}
                {user ? <UserLogged user={user} /> : <LoginButton />}
            </div>
        </header>
    );
}