'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "../store/useCartStore";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const cartCount = useCartStore((state) => state.getCartCount());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#1a120b]/95 backdrop-blur-sm border-b border-[#f4f2f0] dark:border-white/10 shadow-sm transition-colors duration-300">
            <div className="px-4 md:px-10 py-3 mx-auto max-w-[1440px]">
                <div className="flex items-center justify-between gap-4">

                    {/* Logo & Brand */}
                    <Link href="/" className="flex items-center gap-4 flex-shrink-0">
                        <div className="size-8 text-primary">
                            <span className="material-symbols-outlined text-[32px]">restaurant</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight hidden sm:block">Lumiere Eatery</h2>
                    </Link>

                    {/* Search Bar (Hidden on mobile, visible on tablet+) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4">
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                className="block w-full p-2.5 pl-10 text-sm text-slate-900 bg-[#f4f2f0] dark:bg-white/5 dark:text-white rounded-full border-transparent focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder-slate-500 dark:placeholder-slate-400 transition-all outline-none"
                                placeholder="Search for sourdough, cakes..."
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 md:gap-6">

                        {/* Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-6">
                            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/shop">Shop</Link>
                            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/about">About</Link>
                            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/classes">Classes</Link>
                            <Link className="text-sm font-bold text-primary hover:text-orange-600 transition-colors" href="/book">Book Tasting</Link>
                        </nav>
                        <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden lg:block"></div>

                        {/* Icons */}
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 group-hover:text-primary text-[20px]">location_on</span>
                                <span className="text-xs font-semibold hidden xl:block text-slate-700 dark:text-slate-200">Johannesburg</span>
                            </button>

                            <Link href="/account" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-300 hover:text-primary">
                                <span className="material-symbols-outlined text-[20px]">person</span>
                            </Link>

                            <Link href="/cart" className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-300 hover:text-primary inline-block">
                                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                                {mounted && cartCount > 0 && (
                                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-300">
                                <span className="material-symbols-outlined text-[24px]">menu</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity">
                    <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-white dark:bg-[#1a120b] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#1a120b] z-10">
                            <h3 className="font-bold text-slate-900 dark:text-white">Menu</h3>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-4">
                                <Link onClick={() => setIsMenuOpen(false)} href="/" className={`text-lg font-bold transition-colors ${isActive('/') ? 'text-primary' : 'text-slate-700 dark:text-slate-300 hover:text-primary'}`}>Home</Link>
                                <Link onClick={() => setIsMenuOpen(false)} href="/shop" className={`text-lg font-bold transition-colors ${isActive('/shop') ? 'text-primary' : 'text-slate-700 dark:text-slate-300 hover:text-primary'}`}>Shop</Link>
                                <Link onClick={() => setIsMenuOpen(false)} href="/about" className={`text-lg font-bold transition-colors ${isActive('/about') ? 'text-primary' : 'text-slate-700 dark:text-slate-300 hover:text-primary'}`}>About</Link>
                                <Link onClick={() => setIsMenuOpen(false)} href="/classes" className={`text-lg font-bold transition-colors ${isActive('/classes') ? 'text-primary' : 'text-slate-700 dark:text-slate-300 hover:text-primary'}`}>Classes</Link>
                                <Link onClick={() => setIsMenuOpen(false)} href="/book" className={`text-lg font-bold transition-colors ${isActive('/book') ? 'text-primary' : 'text-slate-700 dark:text-slate-300 hover:text-primary'}`}>Book Tasting</Link>
                            </div>

                            <hr className="border-slate-100 dark:border-white/5" />

                            <div className="flex flex-col gap-4">
                                <Link onClick={() => setIsMenuOpen(false)} href="/account" className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">person</span>
                                    My Account
                                </Link>
                                <Link onClick={() => setIsMenuOpen(false)} href="/cart" className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                                    Shopping Cart ({mounted ? cartCount : 0})
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
