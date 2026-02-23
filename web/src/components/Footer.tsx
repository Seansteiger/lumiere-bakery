import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-white dark:bg-[#150f0a] border-t border-slate-100 dark:border-white/5 pt-16 pb-8">
            <div className="px-4 md:px-10 mx-auto max-w-[1440px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined text-[32px]">restaurant</span>
                            <span className="text-slate-900 dark:text-white text-xl font-bold">Lumiere Eatery</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Crafting memories one slice at a time. Visit our Johannesburg flagship store for a sensory experience like no other.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <Link href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">thumb_up</span></Link>
                            <Link href="#" className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">photo_camera</span></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Shop</h4>
                        <ul className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link className="hover:text-primary transition-colors" href="/shop">All Products</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/shop/wedding-cakes">Wedding Cakes</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/shop/sourdough-subscription">Sourdough Subscription</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/gift-cards">Gift Cards</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Support</h4>
                        <ul className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link className="hover:text-primary transition-colors" href="/contact">Contact Us</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/faq">FAQ</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/delivery-info">Delivery Info</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/admin">Admin Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Visit Us</h4>
                        <ul className="flex flex-col gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <li className="flex gap-3">
                                <span className="material-symbols-outlined text-primary shrink-0">location_on</span>
                                <span>12 Baker Street, Rosebank,<br />Johannesburg, 2196</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="material-symbols-outlined text-primary shrink-0">schedule</span>
                                <span>Mon - Sun: 07:00 - 18:00</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="material-symbols-outlined text-primary shrink-0">call</span>
                                <span>+27 11 123 4567</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                    <p>© 2026 Lumiere Eatery. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link className="hover:text-slate-600 dark:hover:text-slate-200" href="/privacy">Privacy Policy</Link>
                        <Link className="hover:text-slate-600 dark:hover:text-slate-200" href="/terms">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
