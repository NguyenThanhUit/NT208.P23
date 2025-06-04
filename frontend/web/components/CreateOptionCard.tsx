
import Link from "next/link";
import { Card } from "flowbite-react";
import { ReactNode } from "react";

type Props = {
    icon: ReactNode;
    title: string;
    description: string;
    href: string;
};

export default function CreateOptionCard({ icon, title, description, href }: Props) {
    return (
        <Link href={href} className="w-full sm:w-1/2 md:w-1/3 p-4">
            <Card className="hover:shadow-xl transition duration-300 cursor-pointer h-full text-center">
                <div className="flex justify-center text-4xl mb-2 text-red-600">
                    {icon}
                </div>
                <h5 className="text-xl font-semibold">{title}</h5>
                <p className="text-gray-600">{description}</p>
            </Card>
        </Link>
    );
}
