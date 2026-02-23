'use client';

import { useState } from 'react';
import { useCartStore, CartItem } from '../store/useCartStore';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface AddToCartProps {
    product: {
        id: string;
        name: string;
        price: number;
        image: string;
        slug: string;
    };
    variant?: 'button' | 'icon'; // 'button' for product page, 'icon' for product cards
    className?: string;
}

export default function AddToCart({ product, variant = 'button', className }: AddToCartProps) {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault(); // In case it's wrapped in a Link
        addItem({ ...product, quantity });
        // Optional: add a toast notification here
    };

    if (variant === 'icon') {
        return (
            <button
                title="Add to Cart"
                onClick={handleAdd}
                className={cn(
                    "absolute z-10 bottom-3 right-3 bg-white dark:bg-slate-800 text-primary p-2 rounded-full shadow-md translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white",
                    className
                )}
            >
                <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            </button>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-lg p-1 self-start sm:self-auto h-14">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 md:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-shadow shrink-0 text-slate-600 dark:text-slate-300 h-full"
                >
                    <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 md:p-3 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-shadow shrink-0 text-slate-600 dark:text-slate-300 h-full"
                >
                    <span className="material-symbols-outlined">add</span>
                </button>
            </div>

            <button
                onClick={handleAdd}
                className={cn(
                    "flex-1 bg-primary hover:bg-primary/90 text-white h-14 rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-transform active:scale-95",
                    className
                )}
            >
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                Add to Cart
            </button>
        </div>
    );
}
