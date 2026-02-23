'use client';

import { useState } from 'react';
import Link from 'next/link';
import { pb } from "@/lib/pocketbase";
import { useRouter } from "next/navigation";

export default function BookingPage() {
    const [formData, setFormData] = useState({
        eventDate: '',
        eventType: '',
        tastingDate: '',
        tastingTime: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        guests: '2',
        notes: ''
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const fakeYocoId = 'yoco_tx_' + Math.random().toString(36).substring(2, 9);

            const payload = {
                user_email: formData.email,
                customer_name: `${formData.firstName} ${formData.lastName}`,
                phone: formData.phone,
                items: { type: 'tasting_booking', guests: formData.guests, tastingDate: formData.tastingDate, notes: formData.notes },
                total: 350.00,
                fulfillment: 'pickup',
                status: 'pending',
                booking_date: formData.eventDate ? `${formData.eventDate} 12:00:00.000Z` : '',
                booking_time: formData.tastingTime,
                payment_status: 'paid',
                payment_method: 'Yoco',
                yoco_transaction_id: fakeYocoId,
                guest_count: parseInt(formData.guests),
                event_type: formData.eventType
            };

            await pb.collection('orders').create(payload);

            alert('Booking request submitted! We will contact you soon.');
            router.push('/');
        } catch (error) {
            console.error('Failed to save booking:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="bg-[#fcf9f5] dark:bg-[#150f0a] min-h-screen py-16 md:py-24">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                        Book a <span className="text-primary italic">Tasting</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Schedule a private consultation and cake tasting for your wedding or special event. Let's create something extraordinary together.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {/* Booking Information */}
                    <div className="w-full lg:w-1/3 space-y-8">
                        <div className="bg-white dark:bg-[#1a120b] p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-4xl text-primary">celebration</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">What to Expect</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                Our tasting sessions include a sampling of 4 of our most popular cake flavors and fillings, paired with coffee or tea. We'll discuss your vision, design ideas, and provide a comprehensive quote.
                            </p>
                            <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 font-bold">
                                <li className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                                    <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                                    45 - 60 Minutes
                                </li>
                                <li className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                                    <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
                                    R 350.00 (Credited towards order)
                                </li>
                                <li className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                                    <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
                                    Up to 3 Guests
                                </li>
                            </ul>
                        </div>

                        <div className="bg-slate-900 dark:bg-white p-8 rounded-2xl text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-none">
                            <h3 className="text-lg font-bold mb-3">Need Help?</h3>
                            <p className="text-slate-300 dark:text-slate-600 text-sm mb-6">
                                If you have any questions before booking, please don't hesitate to reach out to our event coordination team.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 font-bold hover:gap-3 transition-all text-primary dark:text-primary">
                                Contact Us <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </Link>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white dark:bg-[#1a120b] p-6 md:p-10 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-orange-300"></div>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">1</span>
                                        Select Appointment
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Event Date *</label>
                                            <input required type="date" value={formData.eventDate} onChange={e => setFormData({ ...formData, eventDate: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm md:text-base" />
                                            <p className="text-xs text-slate-500 mt-2 font-medium">When is your event taking place?</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Event Type *</label>
                                            <select required value={formData.eventType} onChange={e => setFormData({ ...formData, eventType: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm md:text-base">
                                                <option value="" disabled>Select an event type</option>
                                                <option value="wedding">Wedding</option>
                                                <option value="birthday">Birthday Milestone</option>
                                                <option value="corporate">Corporate Event</option>
                                                <option value="other">Other Special Occasion</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mt-5 md:mt-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tasting Date *</label>
                                            <input required type="date" value={formData.tastingDate} onChange={e => setFormData({ ...formData, tastingDate: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm md:text-base" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Preferred Time *</label>
                                            <select required value={formData.tastingTime} onChange={e => setFormData({ ...formData, tastingTime: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm md:text-base">
                                                <option value="" disabled>Select a time slot</option>
                                                <option value="10:00">10:00 AM</option>
                                                <option value="11:30">11:30 AM</option>
                                                <option value="13:00">01:00 PM</option>
                                                <option value="14:30">02:30 PM</option>
                                                <option value="16:00">04:00 PM</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">2</span>
                                        Your Details
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">First Name *</label>
                                            <input required type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm md:text-base" placeholder="Jane" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Last Name *</label>
                                            <input required type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm md:text-base" placeholder="Smith" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address *</label>
                                            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm md:text-base" placeholder="jane@example.com" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number *</label>
                                            <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm md:text-base" placeholder="+27 82 123 4567" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Guest Count *</label>
                                            <select required value={formData.guests} onChange={e => setFormData({ ...formData, guests: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm md:text-base">
                                                <option value="1">Just Me (1 Person)</option>
                                                <option value="2">2 People</option>
                                                <option value="3">3 People</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Additional Notes or Dietary Requirements</label>
                                            <textarea rows={4} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-sm md:text-base" placeholder="Let us know if you have any specific flavors in mind or allergies we should be aware of..."></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                                    <div className="bg-slate-50 dark:bg-white/5 p-5 md:p-6 rounded-xl text-sm md:text-base text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 flex items-start gap-4 mb-8">
                                        <span className="material-symbols-outlined text-primary text-2xl shrink-0">info</span>
                                        <p className="leading-relaxed">
                                            A non-refundable tasting fee of <strong>R 350.00</strong> is required to secure your booking. This fee will be fully credited towards your final cake order if you proceed with us.
                                        </p>
                                    </div>

                                    <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-16 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95">
                                        Request Booking (R 350.00)
                                        <span className="material-symbols-outlined pb-0.5">event_available</span>
                                    </button>
                                    <p className="text-center text-xs text-slate-500 mt-4 font-medium">
                                        You will be securely redirected to our payment gateway to finalize your reservation.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
