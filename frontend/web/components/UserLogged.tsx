'use client';

import { signOut } from "next-auth/react";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import Link from "next/link";
import { AiOutlineProduct, AiFillTrophy, AiOutlineLogout } from 'react-icons/ai';
import { HiCog } from 'react-icons/hi';
import { MdShoppingCartCheckout } from "react-icons/md";
import { User } from "next-auth";
import { getUserInformation, sendUserInformation } from "@/app/actions/useraction";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
    user: User
};

export default function UserLogged({ user }: Props) {
    const [hasSent, setHasSent] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // Thêm trạng thái loading
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

    async function handleSendUserInfo() {
        if (hasSent) return;
        try {
            await sendUserInformation({
                email: user.email,
                name: user.name,
            });
            setHasSent(true);
            console.log("Đã gửi thông tin user khi mở dropdown");
        } catch (err) {
            console.error("Lỗi khi gửi thông tin user:", err);
        }
    }

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

    if (loading) return null; // hoặc hiển thị skeleton loader

    return (
        <>
            <Dropdown
                inline
                label={
                    <span
                        className="text-black font-semibold cursor-pointer"
                        onClick={handleSendUserInfo}
                    >
                        Welcome, {user.name}
                    </span>
                }
                className="w-56"
            >

                <DropdownItem icon={MdShoppingCartCheckout}>
                    <Link
                        href="/order/history"
                        className="block w-full text-left text-sm text-gray-700 hover:text-blue-600"
                    >
                        Lịch sử mua hàng
                    </Link>
                </DropdownItem>

                {role === "admin" ? (
                    <DropdownItem icon={HiCog} onClick={handleVerifyUserInformation}>
                        <span className="block w-full text-left text-sm text-gray-700 hover:text-blue-600">
                            Duyệt hồ sơ
                        </span>
                    </DropdownItem>
                ) : (
                    <>
                        <DropdownItem icon={AiFillTrophy}>
                            <Link
                                href="/account/Detail"
                                className="block w-full text-left text-sm text-gray-700 hover:text-blue-600"
                            >
                                Thông tin cá nhân
                            </Link>
                        </DropdownItem>

                        <DropdownItem icon={AiOutlineProduct} onClick={handleCreateProductClick}>
                            <span className="block w-full text-left text-sm text-gray-700 hover:text-blue-600">
                                Tạo sản phẩm
                            </span>
                        </DropdownItem>

                        <DropdownItem icon={HiCog}>
                            <Link
                                href="/recharge"
                                className="block w-full text-left text-sm text-gray-700 hover:text-blue-600"
                            >
                                Nạp tiền
                            </Link>
                        </DropdownItem>
                    </>
                )}

                <DropdownDivider />

                <DropdownItem icon={AiOutlineLogout} onClick={handleSignOut}>
                    <span className="block w-full text-left text-sm text-red-600 hover:text-red-800">Đăng xuất</span>
                </DropdownItem>
            </Dropdown>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md text-center">
                        <h2 className="text-lg font-semibold mb-4">Bạn chưa được xác minh</h2>
                        <p className="mb-6 text-sm text-gray-600">Bạn cần gửi thông tin xác minh để trở thành người bán.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={goToSellerPage}
                            >
                                Xác thực thông tin cá nhân
                            </button>
                            <button
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                onClick={() => setShowModal(false)}
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
