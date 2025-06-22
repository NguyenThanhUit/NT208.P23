'use client';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import React from 'react';

type Props = { id: string };

export default function EditButton({ id }: Props) {
    return (
        <Link href={`/auctions/update/${id}`}>
            <Button outline>Cập nhật đấu giá</Button>
        </Link>
    );
}
