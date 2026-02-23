'use client';

import Link from "next/link";
import { useCartStore } from "../../store/useCartStore";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pocketbase";

export default function CheckoutPage() {
    const { items, getCartTotal, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const router = useRouter();

    // Form state placeholder
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        fulfillment: 'pickup',
        date: '',
        time: ''
    });

    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Generate dynamic time slots when date changes
    useEffect(() => {
        if (!formData.date) {
            setAvailableTimes([]);
            return;
        }

        const slots: string[] = [];
        const selectedDate = new Date(formData.date);
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();

        // Business hours: 09:00 to 19:00
        const startHour = 9;
        const endHour = 19;

        // Prep time: 45 minutes
        const prepTimeMs = 45 * 60 * 1000;
        const earliestSlotTime = new Date(today.getTime() + prepTimeMs);

        for (let hour = startHour; hour <= endHour; hour++) {
            for (let min of [0, 30]) {
                const slotDate = new Date(selectedDate);
                slotDate.setHours(hour, min, 0, 0);

                if (isToday) {
                    if (slotDate > earliestSlotTime) {
                        const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                        slots.push(timeString);
                    }
                } else {
                    const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                    slots.push(timeString);
                }
            }
        }

        setAvailableTimes(slots);

        // Clear selected time if it's no longer available
        if (formData.time && !slots.includes(formData.time)) {
            setFormData(prev => ({ ...prev, time: '' }));
        }

    }, [formData.date]);

    // Derived cart totals
    const subtotal = getCartTotal();
    const deliveryFee = formData.fulfillment === 'delivery' ? 50 : 0;
    const total = subtotal + deliveryFee;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent double submissions
        if (isProcessingPayment) return;

        setIsProcessingPayment(true);

        try {
            // Simulate calling Yoco SDK and waiting for payment to process
            await new Promise(resolve => setTimeout(resolve, 2000));
            const fakeYocoId = 'yoco_tx_' + Math.random().toString(36).substring(2, 9);

            const payload = {
                user_email: formData.email,
                customer_name: `${formData.firstName} ${formData.lastName}`,
                phone: formData.phone,
                items: items,
                total: total,
                fulfillment: formData.fulfillment,
                status: 'pending',
                booking_date: formData.date ? `${formData.date} 12:00:00.000Z` : '',
                booking_time: formData.time,
                payment_status: 'paid',
                payment_method: 'Yoco',
                yoco_transaction_id: fakeYocoId
            };

            await pb.collection('orders').create(payload);

            clearCart();
            window.location.href = `/checkout/success?id=${fakeYocoId}`;
        } catch (error) {
            console.error('Failed to save order:', error);
            alert('An error occurred while placing your order. Please try again.');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
                <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[48px] text-slate-300 dark:text-slate-600">shopping_cart_checkout</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Checkout Unavailable</h1>
                <p className="text-slate-500 dark:text-slate-400 text-center mb-8 max-w-md">
                    Your cart is empty. Please add items to your cart before proceeding to checkout.
                </p>
                <Link href="/shop" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                    Back to Shop
                </Link>
            </div>
        );
    }
    return (
        <div className="bg-[#fcf9f5] dark:bg-[#150f0a] min-h-screen pb-20">
            <div className="px-4 md:px-10 py-10 md:py-12 mx-auto max-w-[1440px]">
                <div className="text-sm text-slate-500 mb-8 flex items-center gap-2">
                    <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-primary font-bold">Checkout</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-10">Secure Checkout</h1>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Checkout Form */}
                    <div className="w-full lg:flex-1 space-y-8">

                        {/* Customer Info */}
                        <section className="bg-white dark:bg-[#1a120b] p-6 text-sm md:text-base md:p-8 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">person</span>
                                Customer Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">First Name *</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="John" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Last Name *</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="Doe" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address *</label>
                                    <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
                                    <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="+27 82 123 4567" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>
                        </section>

                        {/* Booking / Fulfillment */}
                        <section className="bg-white dark:bg-[#1a120b] p-6 text-sm md:text-base md:p-8 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">local_shipping</span>
                                Order Fulfillment
                            </h2>

                            <div className="flex gap-4 mb-8">
                                <label className="flex-1 cursor-pointer">
                                    <input type="radio" name="fulfillment" className="peer sr-only" value="pickup" checked={formData.fulfillment === 'pickup'} onChange={e => setFormData({ ...formData, fulfillment: e.target.value })} />
                                    <div className="border-2 border-slate-100 dark:border-white/5 rounded-xl p-5 peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center">
                                        <span className="material-symbols-outlined text-3xl mb-3 text-slate-400 peer-checked:text-primary">storefront</span>
                                        <strong className="block text-slate-900 dark:text-white text-lg mb-1">Store Pickup</strong>
                                        <span className="text-sm font-bold text-green-600 dark:text-green-400">Free</span>
                                    </div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                    <input type="radio" name="fulfillment" className="peer sr-only" value="delivery" checked={formData.fulfillment === 'delivery'} onChange={e => setFormData({ ...formData, fulfillment: e.target.value })} />
                                    <div className="border-2 border-slate-100 dark:border-white/5 rounded-xl p-5 peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center">
                                        <span className="material-symbols-outlined text-3xl mb-3 text-slate-400 peer-checked:text-primary">local_shipping</span>
                                        <strong className="block text-slate-900 dark:text-white text-lg mb-1">Local Delivery</strong>
                                        <span className="text-sm font-bold text-slate-500">R 50.00</span>
                                    </div>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Date *</label>
                                    <input required type="date" min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Time *</label>
                                    <select required disabled={!formData.date || availableTimes.length === 0} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:opacity-50" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}>
                                        <option value="" disabled>{!formData.date ? "Select a date first" : availableTimes.length === 0 ? "No slots available today" : "Choose a time"}</option>
                                        {availableTimes.map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Payment Information */}
                        <section className="bg-white dark:bg-[#1a120b] p-6 text-sm md:text-base md:p-8 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">payment</span>
                                Payment Method
                            </h2>
                            <div className="p-8 border-2 border-slate-100 dark:border-white/5 rounded-xl bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-3xl text-primary">lock</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">credit_card</span>
                                    Payment Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-6 bg-slate-200 dark:bg-white/10 rounded overflow-hidden flex items-center justify-center font-bold text-xs text-slate-600 dark:text-white">
                                                YOCO
                                            </div>
                                            <span className="font-bold text-slate-900 dark:text-white">Pay Securely with Yoco</span>
                                        </div>
                                        <div className="w-5 h-5 rounded-full border-4 border-primary bg-white"></div>
                                    </div>
                                    <p className="text-sm text-slate-500 text-center flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">lock</span>
                                        Payments are secure and encrypted
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0">
                        <div className="bg-white dark:bg-[#1a120b] rounded-2xl border border-slate-100 dark:border-white/5 p-6 md:p-8 sticky top-24 shadow-sm">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
                                Order Summary
                                <span className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-sm py-1 px-3 rounded-full">{items.length} items</span>
                            </h2>

                            <div className="space-y-4 mb-6 max-h-[320px] overflow-y-auto pr-3 custom-scrollbar">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative border border-slate-100 dark:border-white/5">
                                            <Image src={item.image || 'https://via.placeholder.com/150'} alt={item.name} fill className="object-cover" />
                                            <span className="absolute -top-2 -right-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] w-5 h-5 flex items-center justify-center border-2 border-white dark:border-[#1a120b] rounded-full font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                                            <div className="font-bold text-primary mt-1">R {(item.price * item.quantity).toFixed(2)}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">R {item.price.toFixed(2)} each</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 text-slate-600 dark:text-slate-300 py-6 border-y border-slate-100 dark:border-white/5 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span>Subtotal</span>
                                    <span className="font-bold">R {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span>Fulfillment ({formData.fulfillment === 'pickup' ? 'Pickup' : 'Delivery'})</span>
                                    <span className={deliveryFee === 0 ? "font-bold text-green-600 dark:text-green-400" : "font-bold"}>
                                        {deliveryFee === 0 ? 'Free' : `R ${deliveryFee.toFixed(2)}`}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="font-bold text-xl text-slate-900 dark:text-white">Total</span>
                                <span className="font-black text-4xl text-primary">R {total.toFixed(2)}</span>
                            </div>

                            <button type="submit" disabled={isProcessingPayment} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex justify-center items-center gap-2 group disabled:opacity-70 disabled:pointer-events-none">
                                {isProcessingPayment ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-[20px]">autorenew</span>
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        Pay R {total.toFixed(2)} Now
                                        <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-slate-500 mt-4 px-4 bg-slate-50 dark:bg-white/5 py-3 rounded-lg border border-slate-100 dark:border-white/5">
                                By completing your order, you agree to our <Link href="#" className="underline hover:text-primary">Terms of Service</Link> & <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
