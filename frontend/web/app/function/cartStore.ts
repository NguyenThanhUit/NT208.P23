import { create } from 'zustand';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    seller?: string;
}

interface CartState {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
    getTotalQuantity: () => number;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => {
    const savedCart = typeof window !== 'undefined' ? localStorage.getItem('cartItems') : null;
    const initialItems = savedCart ? JSON.parse(savedCart) : [];

    return {
        items: initialItems,
        addToCart: (item) => {
            const items = get().items;
            const index = items.findIndex((i) => i.id === item.id);

            let updatedItems;
            if (index >= 0) {
                updatedItems = [...items];
                updatedItems[index].quantity += item.quantity;
            } else {
                updatedItems = [...items, item];
            }

            localStorage.setItem('cartItems', JSON.stringify(updatedItems));
            set({ items: updatedItems });
        },
        increaseQuantity: (id) => {
            const items = get().items;
            const index = items.findIndex((i) => i.id === id);
            if (index >= 0) {
                const updatedItems = [...items];
                updatedItems[index].quantity += 1; // Increase quantity by 1
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                set({ items: updatedItems });
            }
        },
        decreaseQuantity: (id) => {
            const items = get().items;
            const index = items.findIndex((i) => i.id === id);
            if (index >= 0 && items[index].quantity > 1) {
                const updatedItems = [...items];
                updatedItems[index].quantity -= 1; // Decrease quantity by 1, prevent going below 1
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                set({ items: updatedItems });
            }
        },
        getTotalQuantity: () => {
            return get().items.reduce((acc, item) => acc + item.quantity, 0);
        },
        clearCart: () => { // Clear the cart
            localStorage.removeItem('cartItems');
            set({ items: [] });
        }
    };
});
