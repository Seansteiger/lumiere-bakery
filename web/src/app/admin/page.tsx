'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { pb } from '@/lib/pocketbase';
import ProductModal from '@/components/admin/ProductModal';
import OrderModal from '@/components/admin/OrderModal';
import CouponModal from '@/components/admin/CouponModal';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [metrics, setMetrics] = useState({ revenue: 0, ordersCount: 0, bookingsCount: 0, customersCount: 0 });
    const [topProducts, setTopProducts] = useState<any[]>([]);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [viewingOrder, setViewingOrder] = useState<any>(null);

    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<any>(null);

    const handleProductSaved = async () => {
        const productsData = await pb.collection('products').getFullList({ sort: '-created' });
        setProducts(productsData);
    };

    const handleCouponSaved = async () => {
        const couponsData = await pb.collection('coupons').getFullList({ sort: '-created' });
        setCoupons(couponsData);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const records = await pb.collection('orders').getFullList({
                    sort: '-id'
                });
                setOrders(records);

                const productsData = await pb.collection('products').getFullList({ sort: '-created' });
                setProducts(productsData);

                const couponsData = await pb.collection('coupons').getFullList({ sort: '-created' });
                setCoupons(couponsData);

                const usersData = await pb.collection('users').getFullList({ sort: '-created' });
                setCustomers(usersData);

                let revenue = 0;
                let bookingsCount = 0;
                const productSales: Record<string, { name: string, sales: number, revenue: number }> = {};

                records.forEach(order => {
                    revenue += order.total || 0;
                    if (order.items?.type === 'tasting_booking' || order.event_type) {
                        bookingsCount++;
                    }

                    if (order.cart_data && Array.isArray(order.cart_data)) {
                        order.cart_data.forEach((item: any) => {
                            if (!productSales[item.id]) {
                                productSales[item.id] = { name: item.name, sales: 0, revenue: 0 };
                            }
                            productSales[item.id].sales += item.quantity;
                            productSales[item.id].revenue += item.price * item.quantity;
                        });
                    }
                });

                const sortedProducts = Object.values(productSales).sort((a, b) => b.sales - a.sales).slice(0, 5);
                setTopProducts(sortedProducts);

                setMetrics({
                    revenue,
                    ordersCount: records.length,
                    bookingsCount,
                    customersCount: usersData.length
                });
            } catch (e) {
                console.error("Failed to fetch admin data:", e);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex h-screen bg-[#fcf9f5] dark:bg-[#150f0a] font-display overflow-hidden">

            {/* Admin Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#1a120b] border-r border-[#f4f2f0] dark:border-white/5 flex flex-col transition-all duration-300">
                <div className="h-16 flex items-center px-6 border-b border-[#f4f2f0] dark:border-white/5">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[20px]">monitor_weight</span>
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white tracking-tight">Admin Portal</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview'
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">dashboard</span>
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'orders'
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                        Orders & Bookings
                        {metrics.ordersCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{metrics.ordersCount}</span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'products'
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('customers')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'customers'
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">group</span>
                        Customers
                    </button>
                    <button
                        onClick={() => setActiveTab('marketing')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'marketing'
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">campaign</span>
                        Marketing & Coupons
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings'
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        Store Settings
                    </button>
                </div>

                <div className="p-4 border-t border-[#f4f2f0] dark:border-white/5">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[20px]">storefront</span>
                        View Live Store
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white dark:bg-[#1a120b] border-b border-[#f4f2f0] dark:border-white/5 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-2 text-slate-500">
                        <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                        <span className="text-sm font-medium">Today, Oct 12, 2026</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1a120b]"></span>
                        </button>
                        <div className="h-6 w-px bg-slate-200 dark:bg-white/10"></div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">A</div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">Admin User</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    {/* Dynamic Tab Content Placeholder */}
                    {activeTab === 'overview' && (
                        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Store Overview</h1>
                                <p className="text-slate-500 text-sm mt-1">Here's what's happening in your store today.</p>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-[#1a120b] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined">payments</span>
                                        </div>
                                        <span className="flex items-center text-green-500 text-sm font-bold bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-md">
                                            <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
                                        </span>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</h3>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">R {metrics.revenue.toFixed(2)}</p>
                                </div>
                                <div className="bg-white dark:bg-[#1a120b] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined">shopping_bag</span>
                                        </div>
                                        <span className="flex items-center text-green-500 text-sm font-bold bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-md">
                                            <span className="material-symbols-outlined text-[14px]">trending_up</span> 0%
                                        </span>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Orders</h3>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.ordersCount}</p>
                                </div>
                                <div className="bg-white dark:bg-[#1a120b] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined">event</span>
                                        </div>
                                        <span className="flex items-center text-slate-500 text-sm font-bold bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded-md">
                                            <span className="material-symbols-outlined text-[14px]">trending_flat</span> 0%
                                        </span>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Bookings</h3>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.bookingsCount}</p>
                                </div>
                                <div className="bg-white dark:bg-[#1a120b] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined">group</span>
                                        </div>
                                        <span className="flex items-center text-green-500 text-sm font-bold bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded-md">
                                            <span className="material-symbols-outlined text-[14px]">trending_up</span> 100%
                                        </span>
                                    </div>
                                    <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Customers</h3>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.customersCount}</p>
                                </div>
                            </div>

                            {/* Recent Orders & Top Products */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-white dark:bg-[#1a120b] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col">
                                    <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recent Orders</h3>
                                        <button onClick={() => setActiveTab('orders')} className="text-primary text-sm font-bold hover:underline">View All</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="bg-[#fcf9f5] dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4">Order ID</th>
                                                    <th className="px-6 py-4">Customer</th>
                                                    <th className="px-6 py-4">Status</th>
                                                    <th className="px-6 py-4">Total</th>
                                                    <th className="px-6 py-4 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                                {orders.slice(0, 5).map((order) => (
                                                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">#{order.id.substring(0, 8)}</td>
                                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.customer_name || 'Guest'}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' :
                                                                order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">R {order.total.toFixed(2)}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button onClick={() => { setViewingOrder(order); setIsOrderModalOpen(true); }} className="text-primary font-medium hover:underline">Manage</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {orders.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                            No recent orders found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-[#1a120b] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 p-6">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6">Top Selling Products</h3>
                                    <div className="space-y-6">
                                        {topProducts.map((p, i) => (
                                            <div key={i} className="flex justify-between items-center group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                                        #{i + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-primary transition-colors">{p.name}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">{p.sales} total sales</p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-slate-900 dark:text-white text-sm bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-lg">R {p.revenue.toFixed(0)}</span>
                                            </div>
                                        ))}
                                        {topProducts.length === 0 && (
                                            <p className="text-sm text-slate-500 text-center py-8 bg-slate-50 dark:bg-white/5 rounded-xl border border-dashed border-slate-200 dark:border-white/10">No sales data yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Orders & Bookings</h1>
                                    <p className="text-slate-500 text-sm mt-1">Manage and update customer orders.</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#1a120b] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-[#fcf9f5] dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Order ID</th>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Total</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">#{order.id.substring(0, 8)}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                        <div>{order.customer_name || 'Guest'}</div>
                                                        <div className="text-xs text-slate-500">{order.user_email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{new Date(order.created).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            className="bg-transparent border border-slate-200 dark:border-white/10 rounded-md px-2 py-1 text-xs font-bold focus:ring-primary focus:border-primary outline-none"
                                                            value={order.status}
                                                            onChange={async (e) => {
                                                                const newStatus = e.target.value;
                                                                await pb.collection('orders').update(order.id, { status: newStatus });
                                                                setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                                                            }}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="ready">Ready for Pickup</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">R {(order.total || 0).toFixed(2)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button onClick={() => { setViewingOrder(order); setIsOrderModalOpen(true); }} className="text-primary font-medium hover:underline">View Details</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                                        No orders found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Products</h1>
                                    <p className="text-slate-500 text-sm mt-1">Manage your catalog.</p>
                                </div>
                                <button
                                    onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
                                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    Add Product
                                </button>
                            </div>
                            <div className="bg-white dark:bg-[#1a120b] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-[#fcf9f5] dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Image</th>
                                                <th className="px-6 py-4">Name</th>
                                                <th className="px-6 py-4">Price</th>
                                                <th className="px-6 py-4">Stock</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {products.map((product) => (
                                                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-md overflow-hidden shrink-0">
                                                            <img src={product.image_file ? pb.files.getURL(product, product.image_file) : (product.image || 'https://via.placeholder.com/150')} alt={product.name} className="w-full h-full object-cover" />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                                        <div>{product.name}</div>
                                                        {product.variations && product.variations.length > 0 && (
                                                            <div className="text-xs text-slate-500 font-normal mt-0.5">
                                                                {product.variations.length} variations
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            {product.promo_price > 0 && <span className="text-xs text-slate-400 line-through">R {product.price.toFixed(2)}</span>}
                                                            <span className="font-bold text-primary">R {(product.promo_price || product.price).toFixed(2)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${product.in_stock ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                                                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                                                            className="text-slate-400 hover:text-primary transition-colors p-1"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('Delete this product?')) {
                                                                    await pb.collection('products').delete(product.id);
                                                                    setProducts(products.filter(p => p.id !== product.id));
                                                                }
                                                            }}
                                                            className="text-slate-400 hover:text-red-500 transition-colors p-1 ml-2"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {products.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                        No products found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'customers' && (
                        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Customers</h1>
                                    <p className="text-slate-500 text-sm mt-1">View registered accounts and aggregate spend.</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-[#1a120b] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-[#fcf9f5] dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Phone</th>
                                                <th className="px-6 py-4">Joined</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {customers.map((customer) => (
                                                <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                                {customer.name?.substring(0, 1).toUpperCase() || customer.email?.substring(0, 1).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-900 dark:text-white">{customer.name || 'Unnamed Client'}</div>
                                                                <div className="text-xs text-slate-500">{customer.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{customer.phone || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{new Date(customer.created).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-primary font-medium hover:underline">View Profile</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {customers.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                        No registered customers found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'marketing' && (
                        <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Coupons & Marketing</h1>
                                    <p className="text-slate-500 text-sm mt-1">Manage discount codes and promotions.</p>
                                </div>
                                <button
                                    onClick={() => { setEditingCoupon(null); setIsCouponModalOpen(true); }}
                                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    Create Coupon
                                </button>
                            </div>
                            <div className="bg-white dark:bg-[#1a120b] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-[#fcf9f5] dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Code</th>
                                                <th className="px-6 py-4">Discount</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                            {coupons.map((coupon) => (
                                                <tr key={coupon.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 font-mono font-bold text-primary uppercase">{coupon.code}</td>
                                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                        {coupon.discount_type === 'percentage' ? `${coupon.value}% off` : `R ${coupon.value} off`}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${coupon.active ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'}`}>
                                                            {coupon.active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => { setEditingCoupon(coupon); setIsCouponModalOpen(true); }}
                                                            className="text-slate-400 hover:text-primary transition-colors p-1"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (confirm('Delete this coupon?')) {
                                                                    await pb.collection('coupons').delete(coupon.id);
                                                                    setCoupons(coupons.filter(c => c.id !== coupon.id));
                                                                }
                                                            }}
                                                            className="text-slate-400 hover:text-red-500 transition-colors p-1 ml-2"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {coupons.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                                        No coupons found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Store Settings</h1>
                                <p className="text-slate-500 text-sm mt-1">Manage global preferences and contact information.</p>
                            </div>

                            <div className="bg-white dark:bg-[#1a120b] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                                <div className="p-6 md:p-8 space-y-8">

                                    {/* General Information */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-white/5 pb-2">General Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Store Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue="Lumiere Bakery"
                                                    className="w-full bg-slate-50 dark:bg-[#1a120b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Currency Symbol</label>
                                                <input
                                                    type="text"
                                                    defaultValue="ZAR (R)"
                                                    className="w-full bg-slate-50 dark:bg-[#1a120b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tax Rate (%)</label>
                                                <input
                                                    type="number"
                                                    defaultValue="15"
                                                    className="w-full bg-slate-50 dark:bg-[#1a120b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact & Location */}
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-white/5 pb-2">Contact & Location</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Support Email</label>
                                                <input
                                                    type="email"
                                                    defaultValue="support@lumierebakery.co.za"
                                                    className="w-full bg-slate-50 dark:bg-[#1a120b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Support Phone Number</label>
                                                <input
                                                    type="tel"
                                                    defaultValue="+27 72 345 6789"
                                                    className="w-full bg-slate-50 dark:bg-[#1a120b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Physical Store Address</label>
                                                <textarea
                                                    defaultValue="123 Coffee Lane, Rosebank, Johannesburg, 2196"
                                                    rows={3}
                                                    className="w-full bg-slate-50 dark:bg-[#1a120b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="bg-slate-50 dark:bg-white/5 p-6 border-t border-slate-100 dark:border-white/5 flex justify-end">
                                    <button onClick={() => alert('Settings saved successfully (Mock)')} className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-xl font-bold transition-all">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>

            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                product={editingProduct}
                onSave={handleProductSaved}
            />

            <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                order={viewingOrder}
                onStatusChange={(orderId, newStatus) => {
                    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                    if (viewingOrder && viewingOrder.id === orderId) {
                        setViewingOrder({ ...viewingOrder, status: newStatus });
                    }
                }}
            />

            <CouponModal
                isOpen={isCouponModalOpen}
                onClose={() => setIsCouponModalOpen(false)}
                coupon={editingCoupon}
                onSave={handleCouponSaved}
            />
        </div>
    );
}
