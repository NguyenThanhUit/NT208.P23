
import { getDetailedProduct } from "@/app/actions/orderactions";
import ProductForm from "@/components/ProductForm";

export default async function Update({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getDetailedProduct(id);

    return (
        <div className="mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg">
            <ProductForm defaultValues={data} />
        </div>
    )
}