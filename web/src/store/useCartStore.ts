import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { pb } from '@/lib/pocketbase';

export interface CartItem {
    id: string; // Product id
    name: string;
    price: number;
    image: string;
    quantity: number;
    slug: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                set((state) => {
                    const existing = state.items.find((i) => i.id === item.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                });
            },
            removeItem: (id) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                }));
            },
            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
                    ),
                }));
            },
            clearCart: () => set({ items: [] }),
            getCartTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
            getCartCount: () => {
                const { items } = get();
                return items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'lumiere-cart-storage',
        }
    )
);

let syncTimeout: NodeJS.Timeout;

useCartStore.subscribe((state) => {
    if (typeof window === 'undefined') return;

    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(async () => {
        try {
            let guestId = localStorage.getItem('lumiere_guest_id');
            if (!guestId) {
                // Simple random ID for guest carts
                guestId = Math.random().toString(36).substring(2, 15);
                localStorage.setItem('lumiere_guest_id', guestId);
            }

            const isAuth = pb.authStore.isValid;
            const userEmail = isAuth ? pb.authStore.model?.email : '';

            // Build filter
            let filter = `guest_id = "${guestId}"`;
            if (isAuth && userEmail) {
                filter = `user_email = "${userEmail}"`;
            }

            let existingRecord = null;
            try {
                existingRecord = await pb.collection('abandoned_carts').getFirstListItem(filter, { $autoCancel: false });
            } catch (e) {
                // Not found
            }

            if (state.items.length === 0 && existingRecord) {
                await pb.collection('abandoned_carts').delete(existingRecord.id, { $autoCancel: false });
                return;
            }

            if (state.items.length === 0) return;

            const data = {
                user_email: userEmail,
                guest_id: guestId,
                cart_data: state.items
            };

            if (existingRecord) {
                await pb.collection('abandoned_carts').update(existingRecord.id, data, { $autoCancel: false });
            } else {
                await pb.collection('abandoned_carts').create(data, { $autoCancel: false });
            }
        } catch (e) {
            console.error("Cart sync failed:", e);
        }
    }, 2000); // 2 second debounce
});
