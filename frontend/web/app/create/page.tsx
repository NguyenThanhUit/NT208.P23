
'use client';

import { AiFillThunderbolt } from "react-icons/ai";
import CreateOptionCard from "@/components/CreateOptionCard";
import { IoLogoGameControllerA } from "react-icons/io";

export default function CreatePage() {
    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Tạo mới</h1>
            <p className="text-center text-gray-500 mb-10">Chọn loại nội dung bạn muốn tạo</p>

            <div className="flex flex-wrap justify-center gap-4">
                <CreateOptionCard
                    icon={<IoLogoGameControllerA />}
                    title="Tạo sản phẩm"
                    description="Đăng bán sản phẩm bạn muốn giao dịch trên thị trường."
                    href="/product/create"
                />
                <CreateOptionCard
                    icon={<AiFillThunderbolt />}
                    title="Tạo đấu giá"
                    description="Tạo phiên đấu giá để người dùng cạnh tranh mua sản phẩm."
                    href="/auctions/create"
                />
            </div>
        </div>
    );
}
