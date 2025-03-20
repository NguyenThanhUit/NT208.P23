import { Order } from ".";

type Props = {
    order: Order;
}
export default function OrderCard({ order }: Props) {
    return (
        <div className="border roundde-lg shadow-md p-4 w-52 text-center">
            <div className="bg-gray-200 h-40 flex justify-center items-center rounded-md">
                {order.ImageUrl ? (
                    <img src={order.ImageUrl} alt={order.Name} className="w-full h-full object-cover rounded-md" />
                ) : (
                    <span className="text-gray-400">No image</span>
                )}
            </div>
            <h3 className="mt-2 font-semibold text-black">{order.Name}</h3>
            <p className="text-lg font-bold text-black">{order.Price}</p>
        </div>
    )
}