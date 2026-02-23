import React, { useState, useEffect } from 'react';
import { X, Tag, Percent, Banknote, Calendar as CalendarIcon } from 'lucide-react';
import { pb } from '@/lib/pocketbase';

interface CouponModalProps {
    isOpen: boolean;
    onClose: () => void;
    coupon?: any;
    onSave: () => void;
}

export default function CouponModal({ isOpen, onClose, coupon, onSave }: CouponModalProps) {
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState('percentage');
    const [value, setValue] = useState('');
    const [minOrderValue, setMinOrderValue] = useState('');
    const [validUntil, setValidUntil] = useState('');
    const [active, setActive] = useState(true);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (coupon) {
                setCode(coupon.code || '');
                setDiscountType(coupon.discount_type || 'percentage');
                setValue(coupon.value?.toString() || '');
                setMinOrderValue(coupon.min_order_value?.toString() || '');
                setValidUntil(coupon.valid_until ? new Date(coupon.valid_until).toISOString().slice(0, 16) : '');
                setActive(coupon.active === undefined ? true : coupon.active);
            } else {
                setCode('');
                setDiscountType('percentage');
                setValue('');
                setMinOrderValue('');
                setValidUntil('');
                setActive(true);
            }
            setError('');
        }
    }, [isOpen, coupon]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim() || !value) {
            setError('Code and value are required');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            const data: any = {
                code: code.trim().toUpperCase(),
                discount_type: discountType,
                value: parseFloat(value),
                active,
            };

            if (minOrderValue) data.min_order_value = parseFloat(minOrderValue);
            else data.min_order_value = 0;

            if (validUntil) {
                // PocketBase expects UTC string
                data.valid_until = new Date(validUntil).toISOString();
            } else {
                data.valid_until = '';
            }

            if (coupon?.id) {
                await pb.collection('coupons').update(coupon.id, data);
            } else {
                await pb.collection('coupons').create(data);
            }

            onSave();
            onClose();
        } catch (err: any) {
            console.error("Save coupon error:", err);
            setError(err.message || "Failed to save coupon.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#1a120b] w-full max-w-2xl rounded-2xl shadow-xl flex flex-col my-auto max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 shrink-0 bg-slate-50 dark:bg-[#150f0a] rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Tag className="w-5 h-5 text-primary" />
                            {coupon ? 'Edit Coupon' : 'Create New Coupon'}
                        </h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                            {coupon ? 'Update promotion details.' : 'Generate a discount code for marketing.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    {error && (
                        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
                            {error}
                        </div>
                    )}

                    <form id="coupon-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Status Toggle */}
                        <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                            <div>
                                <label className="font-bold text-slate-900 dark:text-white">Coupon Status</label>
                                <p className="text-xs text-slate-500">Is this coupon currently active?</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={active} onChange={(e) => setActive(e.target.checked)} />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-green-500"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Code */}
                            <div className="md:col-span-2">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Coupon Code *</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="w-full bg-slate-50 dark:bg-[#1a120b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-bold font-mono focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="e.g. SUMMER2026"
                                    required
                                />
                            </div>

                            {/* Discount Type */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Discount Type *</label>
                                <div className="flex bg-slate-50 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setDiscountType('percentage')}
                                        className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-bold rounded-lg transition-colors ${discountType === 'percentage' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    >
                                        <Percent className="w-4 h-4" /> Percentage
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDiscountType('fixed')}
                                        className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-bold rounded-lg transition-colors ${discountType === 'fixed' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                    >
                                        <Banknote className="w-4 h-4" /> Fixed Amount
                                    </button>
                                </div>
                            </div>

                            {/* Value */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Discount Value *</label>
                                <div className="relative">
                                    {discountType === 'fixed' && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R</span>}
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className={`w-full bg-slate-50 dark:bg-[#1a120b] border border-slate-200 dark:border-white/10 rounded-xl py-3 pr-4 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all ${discountType === 'fixed' ? 'pl-8' : 'pl-4'}`}
                                        placeholder={discountType === 'percentage' ? "20" : "50"}
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                    {discountType === 'percentage' && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>}
                                </div>
                            </div>

                            {/* Min Order Value */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Minimum Order Value</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R</span>
                                    <input
                                        type="number"
                                        value={minOrderValue}
                                        onChange={(e) => setMinOrderValue(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-[#1a120b] border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-8 pr-4 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">Leave blank or 0 for no minimum.</p>
                            </div>

                            {/* Valid Until */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer" onClick={() => (document.getElementById('date-picker') as HTMLInputElement)?.showPicker()}>
                                    Expiration Date <CalendarIcon className="w-3 h-3" />
                                </label>
                                <input
                                    id="date-picker"
                                    type="datetime-local"
                                    value={validUntil}
                                    onChange={(e) => setValidUntil(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-[#1a120b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                                <p className="text-[10px] text-slate-500 mt-1">Leave blank if it never expires.</p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#150f0a] rounded-b-2xl flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="coupon-form"
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? 'Saving...' : 'Save Coupon'}
                    </button>
                </div>
            </div>
        </div>
    );
}
