export default function navbar() {
    return (
        <div>
            <nav className="flex justify-between items-center p-4 border-b">
                <div className="text-lg font-semibold text-black">E-Shop</div>
                <div className="flex space-x-4">
                    <button className="border px-4 py-2 rounded-md text-black">Sản phẩm</button>
                    <button className="border px-4 py-2 rounded-md text-black">Đấu giá</button>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-md">Đăng nhập/Đăng ký</button>
            </nav>
        </div>
    )
}