import { HiTrash } from "react-icons/hi";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteProduct } from "@/app/actions/orderactions";

type Props = {
    id: string;
};

export default function DeleteButton({ id }: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function doDelete() {
        setLoading(true);
        try {
            const res = await deleteProduct(id);
            toast.success("Xoá thành công sản phẩm");
            router.push("/");
            router.refresh();
        } catch (error: any) {
            toast.error("Lỗi xoá: " + (error?.message || "Không xác định"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            size="xs"
            color="failure"
            onClick={doDelete}
            isProcessing={loading}
            className="!px-3 !py-2 text-sm flex items-center gap-1"
        >
            <HiTrash className="text-lg" />
            Xoá
        </Button>
    );
}
