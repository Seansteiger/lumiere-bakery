import React from 'react';
import { X, Calendar, MapPin, Receipt, Phone, User, CheckCircle2, Package, Truck, XCircle } from 'lucide-react';
import { pb } from '@/lib/pocketbase';

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
    onStatusChange: (orderId: string, newStatus: string) => void;
}

export default function OrderModal({ isOpen, onClose, order, onStatusChange }: OrderModalProps) {
    if (!isOpen || !order) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'ready': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
            default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
            case 'cancelled': return <XCircle className="w-4 h-4" />;
            case 'processing': return <Package className="w-4 h-4" />;
            case 'ready': return <Truck className="w-4 h-4" />;
            default: return <Receipt className="w-4 h-4" />;
        }
    };

    const handleStatusUpdate = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        try {
            await pb.collection('orders').update(order.id, { status: newStatus });
            onStatusChange(order.id, newStatus);
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update order status.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#1a120b] w-full max-w-4xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 shrink-0 bg-slate-50 dark:bg-[#150f0a] rounded-t-2xl">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                Order #{order.id.substring(0, 8).toUpperCase()}
                            </h2>
                            <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">Placed on {new Date(order.created).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Update Status</label>
                            <select
                                value={order.status}
                                onChange={handleStatusUpdate}
                                className="bg-white dark:bg-[#1a120b] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none shadow-sm cursor-pointer"
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="ready">Ready for Pickup</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:bg-white/10"></div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Left Column: Items */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-white/5 pb-2">Order Items</h3>
                                <div className="space-y-4">
                                    {order.cart_data && Array.isArray(order.cart_data) ? order.cart_data.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                                            <div className="w-16 h-16 bg-white dark:bg-[#1a120b] rounded-lg overflow-hidden shrink-0 border border-slate-100 dark:border-white/5">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white">{item.name}</h4>
                                                <div className="text-sm text-slate-500 mt-0.5">Qty: <span className="font-bold">{item.quantity}</span></div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-slate-900 dark:text-white">R {(item.price * item.quantity).toFixed(2)}</div>
                                                <div className="text-xs text-slate-400">R {item.price.toFixed(2)} each</div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl text-center text-slate-500 text-sm">No item data available</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-white/5 pb-2">Payment Details</h3>
                                <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-xl border border-slate-100 dark:border-white/5 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">Subtotal</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">R {order.total.toFixed(2)}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                            <span className="font-medium">Discount</span>
                                            <span className="font-bold">- R {order.discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm border-t border-slate-200 dark:border-white/10 pt-3 mt-3">
                                        <span className="text-slate-900 dark:text-white font-bold text-base">Total Paid</span>
                                        <span className="font-black text-primary text-lg">R {order.total.toFixed(2)}</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                                        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Payment Status</span>
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                            {order.payment_status?.toUpperCase() || 'UNPAID'}
                                        </span>
                                    </div>
                                    {order.yoco_transaction_id && (
                                        <div className="mt-2 text-[11px] text-slate-400 font-mono text-right">
                                            TRX: {order.yoco_transaction_id}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Customer & Shipping Info */}
                        <div className="space-y-6">

                            {/* Customer Card */}
                            <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden">
                                <div className="bg-slate-100 dark:bg-white/10 px-4 py-3 font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Customer Info
                                </div>
                                <div className="p-4 space-y-3">
                                    <div>
                                        <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Name</label>
                                        <p className="font-medium text-slate-900 dark:text-white text-sm">{order.customer_name || 'Guest User'}</p>
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Email</label>
                                        <a href={`mailto:${order.user_email}`} className="font-medium text-primary hover:underline text-sm block truncate w-full">{order.user_email}</a>
                                    </div>
                                    <div>
                                        <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Phone</label>
                                        <p className="font-medium text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                                            {order.customer_phone || 'N/A'}
                                            {order.customer_phone && <a href={`tel:${order.customer_phone}`} className="text-primary hover:text-primary/80"><Phone className="w-3.5 h-3.5" /></a>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Card */}
                            {(order.booking_date || order.booking_time || order.delivery_address) && (
                                <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden">
                                    <div className="bg-slate-100 dark:bg-white/10 px-4 py-3 font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Fulfillment Info
                                    </div>
                                    <div className="p-4 space-y-4">
                                        {(order.booking_date || order.booking_time) && (
                                            <div>
                                                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">Scheduled Date & Time</label>
                                                <div className="bg-white dark:bg-[#1a120b] p-2.5 rounded-lg border border-slate-100 dark:border-white/5 text-sm font-medium text-slate-900 dark:text-white flex items-start gap-2">
                                                    <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                    <div>
                                                        <div>{order.booking_date ? new Date(order.booking_date).toLocaleDateString() : 'No date specified'}</div>
                                                        <div className="text-slate-500 mt-0.5">{order.booking_time || 'No time specified'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {order.delivery_address && (
                                            <div>
                                                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">Delivery Address</label>
                                                <div className="bg-white dark:bg-[#1a120b] p-2.5 rounded-lg border border-slate-100 dark:border-white/5 text-sm font-medium text-slate-900 dark:text-white flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                                    <div className="pr-2 leading-relaxed whitespace-pre-wrap">{order.delivery_address}</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Fallback for old orders if needed */}
                                        {order.items?.type === 'tasting_booking' && (
                                            <div className="mt-2 text-xs font-bold text-purple-600 bg-purple-50 p-2 rounded-lg border border-purple-100 text-center">
                                                Tasting Appointment Booking
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
