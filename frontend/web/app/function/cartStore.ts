// app/function/cartStore.ts
import { create } from 'zustand';

interface CartItem {
    productId: string;
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    seller?: string;
    key: string;
    productStatus: string;
}

interface CartState {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
    removeFromCart: (id: string) => void;
    getTotalQuantity: () => number;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => {
    const savedCart = typeof window !== 'undefined' ? localStorage.getItem('cartItems') : null;
    const initialItems = savedCart ? JSON.parse(savedCart) : [];

    const updateLocalStorage = (items: CartItem[]) => {
        localStorage.setItem('cartItems', JSON.stringify(items));
    };

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

            updateLocalStorage(updatedItems);
            set({ items: updatedItems });
        },

        increaseQuantity: (id) => {
            const items = get().items;
            const index = items.findIndex((i) => i.id === id);
            if (index >= 0) {
                const updatedItems = [...items];
                updatedItems[index].quantity += 1;
                updateLocalStorage(updatedItems);
                set({ items: updatedItems });
            }
        },

        decreaseQuantity: (id) => {
            const items = get().items;
            const index = items.findIndex((i) => i.id === id);

            if (index >= 0) {
                const currentItem = items[index];
                let updatedItems = [...items];

                if (currentItem.quantity <= 1) {

                    updatedItems = updatedItems.filter((item) => item.id !== id);


                    if (updatedItems.length === 0) {
                        get().clearCart();
                        return;
                    }
                } else {
                    updatedItems[index].quantity -= 1;
                }

                updateLocalStorage(updatedItems);
                set({ items: updatedItems });
            }
        },

        removeFromCart: (id) => {
            const updatedItems = get().items.filter(item => item.id !== id);

            if (updatedItems.length === 0) {
                get().clearCart();
                return;
            }

            updateLocalStorage(updatedItems);
            set({ items: updatedItems });
        },

        getTotalQuantity: () => {
            return get().items.reduce((acc, item) => acc + item.quantity, 0);
        },

        clearCart: () => {
            localStorage.removeItem('cartItems');
            set({ items: [] });
        }
    };
});
