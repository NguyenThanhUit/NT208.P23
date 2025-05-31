'use client';

import { signOut } from "next-auth/react";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import Link from "next/link";
import { AiOutlineProduct, AiFillTrophy, AiOutlineLogout } from 'react-icons/ai';
import { HiCog } from 'react-icons/hi';
import { MdShoppingCartCheckout } from "react-icons/md";
import { User } from "next-auth";

type Props = {
    user: User
};

export default function UserLogged({ user }: Props) {
    function handleSignOut() {
        signOut({ callbackUrl: '/' });
    }

    return (
        <Dropdown
            inline
            label={<span className="text-black font-semibold">Welcome, {user.name}</span>}
            className="w-56"
        >
            <DropdownItem icon={MdShoppingCartCheckout}>
                <Link
                    href="/Order/History"
                    className="block w-full text-left text-sm text-gray-700 hover:text-blue-600"
                >
                    Lịch sử mua hàng
                </Link>
            </DropdownItem>

            <DropdownItem icon={AiFillTrophy}>
                <Link
                    href="/account/Detail"
                    className="block w-full text-left text-sm text-gray-700 hover:text-blue-600"
                >
                    Thông tin cá nhân
                </Link>
            </DropdownItem>

            <DropdownItem icon={AiOutlineProduct}>
                <Link
                    href="/Create"
                    className="block w-full text-left text-sm text-gray-700 hover:text-blue-600"
                >
                    Tạo sản phẩm
                </Link>
            </DropdownItem>

            <DropdownItem icon={HiCog}>
                <Link
                    href="/recharge"
                    className="block w-full text-left text-sm text-gray-700 hover:text-blue-600"
                >
                    Nạp tiền
                </Link>
            </DropdownItem>

            <DropdownDivider />

            <DropdownItem icon={AiOutlineLogout} onClick={handleSignOut}>
                <span className="block w-full text-left text-sm text-red-600 hover:text-red-800">Đăng xuất</span>
            </DropdownItem>
        </Dropdown>
    );
}
