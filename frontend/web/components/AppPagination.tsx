'use client';

import { Pagination } from "flowbite-react";

type Props = {
    currentPage: number; //Trang hien tai
    pageCount: number; //Tong so trang
    pageChanged: (page: number) => void; //Ham thay doi so luong trang
}

//Ham phan trang
export default function AppPagination({ currentPage, pageCount, pageChanged }: Props) {
    return (
        <Pagination
            currentPage={currentPage}
            onPageChange={e => pageChanged(e)}
            totalPages={pageCount}
            layout="pagination"
            showIcons={true}
            className="mb-6 flex justify-center items-center gap-2 text-blue-600 [&>nav>ul]:gap-1 [&>nav>ul>li>button]:rounded-lg [&>nav>ul>li>button]:px-3 [&>nav>ul>li>button]:py-1 [&>nav>ul>li>button]:hover:bg-blue-100 [&>nav>ul>li>button]:transition-all"
        />

    )
}