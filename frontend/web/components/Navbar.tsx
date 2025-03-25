'use client';
import { useParamStore } from "@/hooks/useParamStore";
import { usePathname, useRouter } from "next/navigation";
import CurrentUser from "./CurrentUser";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react"; // ✅ Thêm useSession

export default function Navbar() {
    const reset = useParamStore(state => state.reset);
    const router = useRouter();
    const pathName = usePathname();
    const { data: session, status } = useSession(); // ✅ Lấy session để kiểm tra đăng nhập

    function doReset() {
        if (pathName !== '/') router.push('/');
        reset();
    }

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between bg-white p-4 shadow-md">
            <div onClick={doReset} className='cursor-pointer flex items-center gap-2 text-3xl font-semibold text-red-500'>
                <div>E-Shop</div>
            </div>

            <div className="flex gap-4 pl-80">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-800 hover:bg-gray-100">
                    Sản phẩm
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-800 hover:bg-gray-100">
                    Đấu giá
                </button>
            </div>

            {/* Hiển thị user nếu đã đăng nhập */}
            {status === "loading" ? (
                <p>Loading...</p>
            ) : session ? (
                <CurrentUser />
            ) : (
                <button
                    onClick={() => signIn('id-server', { callbackUrl: '/', prompt: 'login' })}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                    ĐĂNG NHẬP/ĐĂNG KÝ
                </button>
            )}
        </header>
    );
}
