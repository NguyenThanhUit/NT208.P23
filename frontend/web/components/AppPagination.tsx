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
            onPageChange={e => pageChanged}
            totalPages={pageCount}
            layout="pagination" //bo cuc
            showIcons={true} //Icon chuyen trang
            className="text-blue-500 mb-5"
        ></Pagination>
    )
}