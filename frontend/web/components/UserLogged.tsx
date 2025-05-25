'use client';

import { signOut } from "next-auth/react";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import Link from "next/link";
import { AiFillCar, AiFillTrophy, AiOutlineLogout } from 'react-icons/ai';
import { HiCog, HiUser } from 'react-icons/hi';
import { User } from "next-auth";

type Props = {
    user: User
};

export default function UserLogged({ user }: Props) {
    function handleSignOut() {
        signOut({ callbackUrl: '/' });
    }

    return (
        <Dropdown inline label={
            <span className="text-black font-medium">
                Welcome {user.name} + {user.email}
            </span>
        }>
            <DropdownItem className="text-black" icon={HiUser}>
                <Link href="/Order/History">Lịch sử mua hàng</Link>
            </DropdownItem>
            <DropdownItem className="text-black" icon={AiFillTrophy}>
                <Link href="/account/Detail">Thông tin cá nhân</Link>
            </DropdownItem>
            <DropdownItem className="text-black" icon={AiFillCar}>
                <Link href="/Product/Create">Tạo sản phẩm</Link>
            </DropdownItem>
            <DropdownItem className="text-black" icon={HiCog}>
                <Link href="/recharge">Nạp tiền</Link>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem className="text-black" icon={AiOutlineLogout} onClick={handleSignOut}>
                Đăng xuất
            </DropdownItem>
        </Dropdown>
    );
}
