import { HiTrash } from "react-icons/hi";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteProduct } from "@/app/actions/orderactions";

type Props = {
    id: string;
};
interface ErrorWithMessage {
    message: string;
}

export default function DeleteButton({ id }: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function doDelete() {
        setLoading(true);
        try {
            await deleteProduct(id);
            toast.success("Xoá thành công sản phẩm");
            router.push("/");
            router.refresh();
        } catch (error: unknown) {
            const message =
                error &&
                    typeof error === "object" &&
                    "message" in error &&
                    typeof (error as ErrorWithMessage).message === "string"
                    ? (error as ErrorWithMessage).message
                    : "Không xác định";
            toast.error("Lỗi xoá: " + message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            size="sm"
            color="failure"
            onClick={doDelete}
            isProcessing={loading}
            className="
        flex items-center gap-2
        rounded-lg
        bg-red-600 hover:bg-red-700
        text-white font-semibold
        shadow-md hover:shadow-lg
        transition
        cursor-pointer
        px-4 py-2
        select-none
        disabled:opacity-60 disabled:cursor-not-allowed
      "
            disabled={loading}
        >
            <HiTrash
                className="text-xl text-white
        transition-transform
        hover:scale-110
      "
            />
            Xoá
        </Button>
    );
}
