'use client';

import Link from "next/link";
import { useCartStore } from "../../store/useCartStore";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function CartPage() {
    const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Prevent hydration errors

    const total = getCartTotal();

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
                <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-600">shopping_bag</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your Cart is Empty</h1>
                <p className="text-slate-500 dark:text-slate-400 text-center mb-8 max-w-md">
                    Looks like you haven't added any delicious treats to your cart yet. Let's fix that!
                </p>
                <Link href="/shop" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcf9f5] dark:bg-[#150f0a] py-12 md:py-20">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 md:mb-12 text-center md:text-left">
                    Your <span className="text-primary italic">Cart</span>
                </h1>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Cart Items */}
                    <div className="flex-1">
                        <div className="bg-white dark:bg-[#1a120b] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-3 text-right">Total</div>
                                <div className="col-span-1"></div>
                            </div>

                            <ul className="divide-y divide-slate-100 dark:divide-white/5">
                                {items.map((item) => (
                                    <li key={item.id} className="p-6 flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6 items-center">
                                        {/* Product Info */}
                                        <div className="col-span-6 flex items-center gap-4 w-full">
                                            <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-slate-100 dark:bg-white/5 rounded-lg overflow-hidden relative">
                                                <img
                                                    src={item.image || 'https://via.placeholder.com/150'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1">
                                                    <Link href={`/shop/${item.slug}`} className="hover:text-primary transition-colors">
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                                <div className="text-primary font-bold">R {item.price.toFixed(2)}</div>
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-2 flex justify-center w-full md:w-auto mt-4 md:mt-0">
                                            <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-lg p-1 w-full max-w-[120px]">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-shadow shrink-0 text-slate-600 dark:text-slate-300"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">remove</span>
                                                </button>
                                                <span className="flex-1 text-center font-bold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-shadow shrink-0 text-slate-600 dark:text-slate-300"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="col-span-3 text-right w-full md:w-auto flex justify-between md:block mt-4 md:mt-0">
                                            <span className="md:hidden text-slate-500 font-bold">Subtotal:</span>
                                            <span className="font-bold text-slate-900 dark:text-white text-lg">
                                                R {(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>

                                        {/* Remove Action */}
                                        <div className="col-span-1 text-right w-full md:w-auto mt-2 md:mt-0 border-t border-slate-100 dark:border-white/5 md:border-0 pt-4 md:pt-0">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-full transition-colors inline-flex items-center justify-center w-full md:w-auto gap-2 md:gap-0"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                                <span className="md:hidden font-bold">Remove</span>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                                <Link href="/shop" className="text-primary font-bold hover:underline inline-flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    Continue Shopping
                                </Link>
                                <button
                                    onClick={() => clearCart()}
                                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-bold uppercase tracking-wider"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0">
                        <div className="bg-white dark:bg-[#1a120b] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 p-6 md:p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-white/5">Order Summary</h2>

                            <div className="space-y-4 mb-6 text-slate-600 dark:text-slate-300">
                                <div className="flex justify-between items-center">
                                    <span>Subtotal</span>
                                    <span className="font-bold">R {total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Shipping</span>
                                    <span className="text-sm">Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Taxes</span>
                                    <span className="text-sm">Included in total</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-white/5 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-slate-900 dark:text-white text-lg">Total</span>
                                    <span className="font-bold text-primary text-3xl">R {total.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 text-right">Standard delivery typically takes 2-3 business days.</p>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-transform active:scale-95"
                            >
                                Proceed to Checkout
                                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                            </Link>

                            <div className="mt-6 flex items-center justify-center gap-3 text-slate-400">
                                <span className="material-symbols-outlined text-[16px]">lock</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Secure Checkout Process</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
