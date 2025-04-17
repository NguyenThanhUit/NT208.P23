'use client'
import { useParamStore } from "@/hooks/useParamStore";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import Link from "next/link";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { AiFillCar, AiFillTrophy, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import { HiCog, HiUser } from 'react-icons/hi';

// Dùng để return khi đăng nhập thành công
type Props = {
    user: User
}

export default function UserLogged({ user }: Props) {
    const setParams = useParamStore(state => state.setParams);

    return (
        <Dropdown inline label={<span className="text-black">Welcome {user.name}</span>}>
            {/* Đặt màu chữ cho DropdownItem thành màu đen */}
            <DropdownItem className="text-black" icon={HiUser}>
                <Link href={`/Order/History`}>
                    Lịch sử mua hàng
                </Link>
            </DropdownItem>
            <DropdownItem className="text-black" icon={AiFillTrophy}>
                Auctions won
            </DropdownItem>
            <DropdownItem className="text-black" icon={AiFillCar}>
                <Link href={'/Order/Create'}>
                    Tạo đơn hàng
                </Link>
            </DropdownItem>
            <DropdownDivider>
                {/* Đặt màu chữ cho item logout thành màu đen */}
                <DropdownItem className="text-black" icon={AiOutlineLogout} onClick={() => signOut({ callbackUrl: '/' })}>
                    Sign out
                </DropdownItem>
            </DropdownDivider>
        </Dropdown>
    );
}
