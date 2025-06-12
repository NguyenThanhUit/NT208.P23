'use client';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { HiPencilAlt } from 'react-icons/hi';
import React from 'react';

type Props = { id: string };

export default function EditButton({ id }: Props) {
    return (
        <Link href={`/product/update/${id}`} passHref>
            <Button
                className="px-6 py-3 bg-red-600 text-white text-lg rounded-lg hover:bg-red-700 transition-all w-full sm:w-fit"
            >
                <HiPencilAlt className="text-lg mr-2" />
                Cập nhật sản phẩm
            </Button>
        </Link>
    );
}