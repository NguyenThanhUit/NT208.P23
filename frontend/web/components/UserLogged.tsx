'use client';

import { signOut } from "next-auth/react";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import Link from "next/link";
import { AiOutlineProduct, AiFillTrophy, AiOutlineLogout } from 'react-icons/ai';
import { HiCog } from 'react-icons/hi';
import { MdShoppingCartCheckout } from "react-icons/md";
import { User } from "next-auth";
import { getUserInformation } from "@/app/actions/useraction";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineTag } from "react-icons/hi";

type Props = {
    user: User
};

export default function UserLogged({ user }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchUserRole() {
            try {
                const profile = await getUserInformation();
                setRole(profile.role);
            } catch (err) {
                console.error("Lỗi khi lấy thông tin người dùng:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUserRole();
    }, []);

    async function handleCreateProductClick() {
        try {
            const profile = await getUserInformation();
            if (profile.verificationStatus === "approved" && profile.isSeller === true) {
                router.push("/create");
            } else {
                setShowModal(true);
            }
        } catch (err) {
            console.error("Lỗi khi lấy thông tin người dùng:", err);
            alert("Không thể kiểm tra trạng thái xác minh. Vui lòng thử lại sau.");
        }
    }

    async function handleVerifyUserInformation() {
        try {
            const profile = await getUserInformation();
            if (profile.role === "admin") {
                router.push("/admin/pending-sellers");
            }
        } catch (err) {
            console.error("Lỗi khi lấy thông tin người dùng:", err);
            alert("Không thể kiểm tra trạng thái xác minh. Vui lòng thử lại sau.");
        }
    }

    function handleSignOut() {
        signOut({ callbackUrl: '/' });
    }

    function goToSellerPage() {
        setShowModal(false);
        router.push("/seller");
    }

    if (loading) return null;

    return (
        <>
            <Dropdown
                inline
                label={
                    <span className="font-semibold text-black cursor-pointer hover:text-blue-600 transition">
                        Xin chào, {user.name}
                    </span>
                }
                className="w-64 rounded-xl shadow-lg border border-gray-200"
            >

                <DropdownItem icon={MdShoppingCartCheckout}>
                    <Link href="/order/history" className="w-full text-left">
                        Lịch sử mua hàng
                    </Link>
                </DropdownItem>
                <DropdownItem icon={HiOutlineTag}>
                    <Link href="/auctions/history" className="w-full text-left">
                        Lịch sử trúng đấu giá
                    </Link>
                </DropdownItem>

                {role === "admin" ? (
                    <DropdownItem icon={HiCog} onClick={handleVerifyUserInformation}>
                        Duyệt hồ sơ người bán
                    </DropdownItem>
                ) : (
                    <>
                        <DropdownItem icon={AiFillTrophy}>
                            <Link href="/account/Detail" className="w-full text-left">
                                Thông tin cá nhân
                            </Link>
                        </DropdownItem>

                        <DropdownItem icon={AiOutlineProduct} onClick={handleCreateProductClick}>
                            Tạo sản phẩm
                        </DropdownItem>

                        <DropdownItem icon={HiCog}>
                            <Link href="/recharge" className="w-full text-left">
                                Nạp tiền
                            </Link>
                        </DropdownItem>
                    </>
                )}

                <DropdownDivider />

                <DropdownItem icon={AiOutlineLogout} onClick={handleSignOut}>
                    <span className="text-red-600 hover:text-red-800">
                        Đăng xuất
                    </span>
                </DropdownItem>
            </Dropdown>


            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center">
                        <h2 className="text-lg font-bold mb-3 text-gray-800">Tài khoản chưa xác minh</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Bạn cần xác minh thông tin để đăng sản phẩm.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={goToSellerPage}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Xác minh ngay
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                            >
                                Để sau
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
