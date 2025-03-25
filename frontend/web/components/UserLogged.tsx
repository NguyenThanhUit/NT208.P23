'use client'
import { useParamStore } from "@/hooks/useParamStore";
import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { Link } from "lucide-react";
import { User } from "next-auth"
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router"
import { AiFillCar, AiFillTrophy, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai'

import { HiCog, HiUser } from 'react-icons/hi'
//Dùng để return khi đăng nhập thành công
type Props = {
    user: User
}
export default function UserLogged({ user }: Props) {
    const router = useRouter(); //Dung de route
    const pathName = usePathname();
    const setParams = useParamStore(state => state.setParams);
    return (
        <Dropdown inline label={`Welcome ${user.name}`}>
            <DropdownItem icon={HiUser}>
                My Auctions
            </DropdownItem>
            <DropdownItem icon={AiFillTrophy}>
                Auctions won
            </DropdownItem>
            <DropdownItem icon={AiFillCar}>
                <Link href={'/orders/create'}>
                    Create Shop
                </Link>
            </DropdownItem>
            <DropdownDivider>
                <DropdownItem icon={AiOutlineLogout} onClick={() => signOut({ callbackUrl: '/' })}>
                    Sign out
                </DropdownItem>
            </DropdownDivider>
        </Dropdown>
    )
}