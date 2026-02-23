'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { pb } from '@/lib/pocketbase';

export default function AccountPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        setIsAuthenticated(pb.authStore.isValid);

        const fetchOrders = async () => {
            if (pb.authStore.isValid && pb.authStore.model) {
                try {
                    const records = await pb.collection('orders').getFullList({
                        filter: `user_email = "${pb.authStore.model.email}"`,
                        sort: '-id'
                    });
                    setOrders(records);
                } catch (e) {
                    console.error("Failed to fetch orders:", e);
                }
            }
        };

        fetchOrders();

        const unsubscribe = pb.authStore.onChange((token, model) => {
            setIsAuthenticated(pb.authStore.isValid);
            if (pb.authStore.isValid) fetchOrders();
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            if (isLogin) {
                await pb.collection('users').authWithPassword(email, password);
            } else {
                await pb.collection('users').create({
                    email,
                    password,
                    passwordConfirm: password,
                    name: fullName
                });
                await pb.collection('users').authWithPassword(email, password);
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            setErrorMsg(error.message || 'Authentication failed. Please try again.');
        }
    };

    const handleLogout = () => {
        pb.authStore.clear();
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-[#fcf9f5] dark:bg-[#150f0a] min-h-[80vh] flex items-center justify-center py-12 px-4">
                <div className="bg-white dark:bg-[#1a120b] w-full max-w-md p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-primary">person</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                            {isLogin ? 'Welcome Back' : 'Create an Account'}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {isLogin ? 'Enter your details to access your account.' : 'Join us to track orders and save your favorites.'}
                        </p>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold mb-6 text-center shadow-sm border border-red-100 dark:border-red-900 dark:bg-red-500/10">
                            {errorMsg}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleAuth}>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                            <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                                {isLogin && <Link href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</Link>}
                            </div>
                            <input required type="password" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>

                        <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 mt-8">
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-slate-500">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold hover:underline">
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fcf9f5] dark:bg-[#150f0a] min-h-screen py-12 md:py-20">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Sidebar */}
                    <div className="w-full lg:w-[320px] flex-shrink-0">
                        <div className="bg-white dark:bg-[#1a120b] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden sticky top-24">
                            <div className="p-8 text-center border-b border-slate-100 dark:border-white/5">
                                <div className="w-24 h-24 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-[#1a120b] shadow-sm overflow-hidden">
                                    {pb.authStore.model?.avatar ? (
                                        <img src={pb.files.getURL(pb.authStore.model, pb.authStore.model.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{pb.authStore.model?.name || pb.authStore.model?.email?.split('@')[0]}</h2>
                                <p className="text-sm text-slate-500 mt-1">{pb.authStore.model?.email}</p>
                            </div>
                            <div className="p-4">
                                <nav className="space-y-1">
                                    <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-colors text-left ${activeTab === 'orders' ? 'text-primary bg-primary/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>
                                        <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                                        Order History
                                    </button>
                                    <button onClick={() => setActiveTab('details')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-colors text-left ${activeTab === 'details' ? 'text-primary bg-primary/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>
                                        <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                                        Account Details
                                    </button>
                                    <button onClick={() => setActiveTab('saved')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-colors text-left ${activeTab === 'saved' ? 'text-primary bg-primary/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}>
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                        Saved Items
                                    </button>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left mt-4">
                                        <span className="material-symbols-outlined text-[20px]">logout</span>
                                        Sign Out
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                                {activeTab === 'orders' ? 'Order History' : activeTab === 'details' ? 'Account Details' : 'Saved Items'}
                            </h1>
                            <p className="text-slate-500 mb-8">
                                {activeTab === 'orders' ? 'View and track your previous orders.' : activeTab === 'details' ? 'Manage your personal information.' : 'View items you have saved for later.'}
                            </p>
                        </div>

                        {/* Recent Orders List */}
                        {activeTab === 'orders' && (
                            <div className="space-y-6">
                                {orders.length === 0 ? (
                                    <div className="text-center py-10 text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">receipt_long</span>
                                        <p>You haven't placed any orders yet.</p>
                                    </div>
                                ) : (
                                    orders.map((order) => (
                                        <div key={order.id} className="bg-white dark:bg-[#1a120b] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                                            <div className="bg-slate-50 dark:bg-white/5 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-white/5 gap-4">
                                                <div className="flex items-center gap-6">
                                                    <div>
                                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Order Placed</p>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(order.created).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Total</p>
                                                        <p className="text-sm font-bold text-primary">R {order.total.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Order #</p>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{order.id}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ml-auto md:ml-0 border ${order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' :
                                                        order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                                        }`}>
                                                        <span className="capitalize">{order.status}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex flex-col gap-4 mb-6">
                                                    {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                                                                {item.image ? (
                                                                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                                                ) : (
                                                                    <span className="material-symbols-outlined text-slate-400">inventory_2</span>
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-slate-900 dark:text-white">{item.name || 'Custom Tasting Booking'}</h3>
                                                                <p className="text-sm text-slate-500">Qty: {item.quantity || item.guests || 1}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <Link href="/shop" className="text-primary font-bold text-sm hover:underline">
                                                                    Buy Again
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-white/5">
                                                    <button className="px-5 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                                        View Invoice
                                                    </button>
                                                    <button className="px-5 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[18px]">support_agent</span>
                                                        Get Support
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="bg-white dark:bg-[#1a120b] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 p-8">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Information</h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                                            <input type="text" disabled value={pb.authStore.model?.name || ''} className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                                            <input type="email" disabled value={pb.authStore.model?.email || ''} className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white" />
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold rounded-xl mt-4 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                                        Edit Details
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'saved' && (
                            <div className="text-center py-20 text-slate-500 bg-white dark:bg-[#1a120b] rounded-2xl border border-slate-100 dark:border-white/5">
                                <span className="material-symbols-outlined text-4xl mb-3 opacity-50">favorite</span>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Saved Items</h2>
                                <p>You haven't saved any items yet. Browse our shop to find something you love!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
