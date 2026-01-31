'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Target, Trophy, Coins, Sparkles, Zap, ArrowRight, X, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Order {
    maker: string;
    asset: string;
    strikePrice: string;
    expiry: number;
    premium: string;
    collateralRequired: string;
    isCall: boolean;
    isLong: boolean;
    apy?: string;
    signature?: string;
    orderData?: any;
}

export default function Orders() {
    const [filterAsset, setFilterAsset] = useState<'all' | 'BTC' | 'ETH'>('all');
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showExecuteModal, setShowExecuteModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [executeStep, setExecuteStep] = useState(1); // 1=summary, 2=approve, 3=execute
    const [collateralAmount, setCollateralAmount] = useState('');
    const [isApproving, setIsApproving] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, [filterAsset]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const endpoint = filterAsset === 'all'
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/orders`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/orders/${filterAsset}`;

            const res = await fetch(endpoint);
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExecuteOrder = (order: Order) => {
        setSelectedOrder(order);
        setCollateralAmount(order.collateralRequired);
        setShowExecuteModal(true);
        setExecuteStep(1);
    };

    const handleApproveUSDC = async () => {
        setIsApproving(true);
        // TODO: Implement USDC approval transaction
        setTimeout(() => {
            setIsApproving(false);
            setExecuteStep(3);
        }, 2000);
    };

    const handleExecute = async () => {
        setIsExecuting(true);
        // TODO: Implement execute order transaction
        setTimeout(() => {
            setIsExecuting(false);
            setShowExecuteModal(false);
            // Redirect to dashboard
            window.location.href = '/dashboard';
        }, 2000);
    };

    const totalOrders = orders.length;
    const bestAPY = orders.length > 0 ? Math.max(...orders.map(o => parseFloat(o.apy || '0'))) : 0;
    const avgPremium = orders.length > 0
        ? orders.reduce((sum, o) => sum + parseFloat(o.premium), 0) / orders.length
        : 0;

    return (
        <>
            <Navbar />

            {/* HERO SECTION - Ocean Blue Gradient */}
            <section className="relative min-h-[60vh] bg-gradient-to-br from-[#0A4A7C] via-[#0284C7] to-[#06B6D4] pt-24 pb-12 overflow-hidden">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,152,255,0.3),transparent_50%)] animate-pulse" />

                {/* Floating orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-[#C15BFF] rounded-full blur-3xl opacity-30 animate-float" />
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FBFF2B] rounded-full blur-3xl opacity-20 animate-float-delayed" />
                    <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#00FFF0] rounded-full blur-3xl opacity-25 animate-float-slow" />
                </div>

                {/* Floating Icons */}
                <div className="absolute top-20 right-8 md:right-20 animate-bounce" style={{ animationDelay: '0.2s' }}>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FFBC57] to-[#FF9500] rounded-xl flex items-center justify-center shadow-xl rotate-12 backdrop-blur-sm border-2 border-white/30">
                        <Trophy className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                </div>

                <div className="absolute top-32 left-12 md:left-24 animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center shadow-xl -rotate-12 backdrop-blur-sm border-2 border-white/30">
                        <Coins className="w-5 h-5 text-white drop-shadow-lg" />
                    </div>
                </div>

                <div className="absolute bottom-16 left-8 md:left-16 animate-bounce" style={{ animationDelay: '0.8s' }}>
                    <div className="w-14 h-14 bg-gradient-to-br from-[#A855F7] to-[#9333EA] rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/40">
                        <Sparkles className="w-7 h-7 text-white drop-shadow-lg" />
                    </div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 space-y-6 md:space-y-8">
                    {/* Header with Back Button */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <Link
                            href="/dashboard"
                            className="group w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl flex items-center justify-center shadow-xl hover:bg-white/20 hover:scale-105 hover:-translate-y-1 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight">
                                Pilih Strategi 💰
                            </h1>
                            <p className="text-base sm:text-lg text-white/80 font-semibold mt-1">
                                Beli murah dapat cashback - Cash-Secured Put
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-4xl">
                        <div className="bg-white/15 backdrop-blur-md border-2 border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl">
                            <div className="flex items-center gap-2 md:gap-3 mb-2">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] rounded-lg flex items-center justify-center">
                                    <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                                <p className="text-xs md:text-sm text-white/70 font-bold">Total Orders</p>
                            </div>
                            <p className="text-2xl md:text-4xl font-black text-white">{totalOrders}</p>
                        </div>

                        <div className="bg-white/15 backdrop-blur-md border-2 border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl">
                            <div className="flex items-center gap-2 md:gap-3 mb-2">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                                <p className="text-xs md:text-sm text-white/70 font-bold">Best APY</p>
                            </div>
                            <p className="text-2xl md:text-4xl font-black text-white">{bestAPY.toFixed(1)}%</p>
                        </div>

                        <div className="bg-white/15 backdrop-blur-md border-2 border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl">
                            <div className="flex items-center gap-2 md:gap-3 mb-2">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#FFBC57] to-[#FF9500] rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </div>
                                <p className="text-xs md:text-sm text-white/70 font-bold">Avg Premium</p>
                            </div>
                            <p className="text-2xl md:text-4xl font-black text-white">{avgPremium.toFixed(0)}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ORDERS SECTION - White Background */}
            <section className="bg-white py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Filter Buttons */}
                    <div className="mb-8">
                        <div className="flex gap-3 bg-gray-100 p-2 rounded-2xl max-w-md">
                            <button
                                onClick={() => setFilterAsset('all')}
                                className={`flex-1 py-2.5 md:py-3 px-3 md:px-6 rounded-xl font-bold text-sm md:text-base transition-all ${filterAsset === 'all'
                                        ? 'bg-gradient-to-r from-[#00FFF0] to-[#0A98FF] text-white shadow-lg scale-105'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                All ({totalOrders})
                            </button>
                            <button
                                onClick={() => setFilterAsset('BTC')}
                                className={`flex-1 py-2.5 md:py-3 px-3 md:px-6 rounded-xl font-bold text-sm md:text-base transition-all ${filterAsset === 'BTC'
                                        ? 'bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white shadow-lg scale-105'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                BTC
                            </button>
                            <button
                                onClick={() => setFilterAsset('ETH')}
                                className={`flex-1 py-2.5 md:py-3 px-3 md:px-6 rounded-xl font-bold text-sm md:text-base transition-all ${filterAsset === 'ETH'
                                        ? 'bg-gradient-to-r from-[#A855F7] to-[#9333EA] text-white shadow-lg scale-105'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                ETH
                            </button>
                        </div>
                    </div>

                    {/* Orders Grid */}
                    {isLoading ? (
                        <div className="text-center py-20">
                            <Loader2 className="w-12 h-12 text-[#0A98FF] animate-spin mx-auto mb-4" />
                            <p className="text-gray-600 font-semibold">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Target className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-xl font-bold text-gray-600 mb-2">No orders available</p>
                            <p className="text-gray-500">Try selecting a different asset</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {orders.map((order, index) => {
                                const gradientConfigs = [
                                    { bg: 'from-[#C15BFF] to-[#9333EA]', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
                                    { bg: 'from-[#00FFF0] to-[#0A98FF]', border: 'border-cyan-200', badge: 'bg-cyan-100 text-cyan-700' },
                                    { bg: 'from-[#FFBC57] to-[#FF9500]', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
                                ];
                                const config = gradientConfigs[index % 3];

                                return (
                                    <div
                                        key={index}
                                        className="group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-gray-200 hover:border-gray-300 hover:scale-[1.02] hover:-translate-y-1 transition-all"
                                    >
                                        {/* Asset Badge */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${config.badge} border-2`}>
                                                {order.asset}
                                            </span>
                                            <span className="text-xs text-gray-500 font-semibold">
                                                Cash-Secured Put
                                            </span>
                                        </div>

                                        {/* Strike Price */}
                                        <div className="mb-4">
                                            <p className="text-xs text-gray-600 mb-1 font-semibold">Strike Price</p>
                                            <p className="text-2xl md:text-3xl font-black text-[#0A4A7C]">
                                                ${parseFloat(order.strikePrice).toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                                                <p className="text-xs text-gray-600 mb-1 font-semibold">Premium</p>
                                                <p className="text-base font-black text-green-600">{order.premium} USDC</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                                                <p className="text-xs text-gray-600 mb-1 font-semibold">APY</p>
                                                <p className="text-base font-black text-[#00FFF0]">{order.apy || '8.5'}%</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                                                <p className="text-xs text-gray-600 mb-1 font-semibold">Collateral</p>
                                                <p className="text-base font-black text-[#0A4A7C]">{order.collateralRequired} USDC</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                                                <p className="text-xs text-gray-600 mb-1 font-semibold">Expiry</p>
                                                <p className="text-base font-black text-gray-600">
                                                    {new Date(order.expiry * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Execute Button */}
                                        <button
                                            onClick={() => handleExecuteOrder(order)}
                                            className="w-full bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white px-6 py-3 rounded-2xl font-bold shadow-[0_6px_0_0_rgba(255,149,0,0.4)] hover:shadow-[0_8px_0_0_rgba(255,149,0,0.4)] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(255,149,0,0.4)] transition-all flex items-center justify-center gap-2"
                                        >
                                            Execute Order
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* EXECUTE ORDER MODAL */}
            {showExecuteModal && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowExecuteModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#0A4A7C] to-[#0284C7] p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-white">Execute Order</h3>
                                <button
                                    onClick={() => setShowExecuteModal(false)}
                                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Steps Indicator */}
                            <div className="flex items-center gap-2 mt-6">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="flex-1 flex items-center gap-2">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${executeStep >= step
                                                    ? 'bg-white text-[#0A4A7C]'
                                                    : 'bg-white/20 text-white/60'
                                                }`}
                                        >
                                            {executeStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                                        </div>
                                        {step < 3 && (
                                            <div className={`flex-1 h-1 rounded ${executeStep > step ? 'bg-white' : 'bg-white/20'}`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8">
                            {executeStep === 1 && (
                                <div className="space-y-6">
                                    <h4 className="text-xl font-black text-[#0A4A7C]">Order Summary</h4>

                                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-semibold">Asset</span>
                                            <span className="font-black text-[#0A4A7C]">{selectedOrder.asset}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-semibold">Strike Price</span>
                                            <span className="font-black text-[#0A4A7C]">${parseFloat(selectedOrder.strikePrice).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-semibold">Premium</span>
                                            <span className="font-black text-green-600">{selectedOrder.premium} USDC</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-semibold">Collateral Required</span>
                                            <span className="font-black text-[#0A4A7C]">{selectedOrder.collateralRequired} USDC</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 font-semibold">Expiry</span>
                                            <span className="font-black text-[#0A4A7C]">
                                                {new Date(selectedOrder.expiry * 1000).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                                        <p className="text-sm text-green-800 font-semibold">
                                            ✅ You will receive <span className="font-black">{selectedOrder.premium} USDC</span> premium instantly!
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setExecuteStep(2)}
                                        className="w-full bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white px-6 py-4 rounded-2xl font-bold shadow-[0_6px_0_0_rgba(255,149,0,0.4)] hover:shadow-[0_8px_0_0_rgba(255,149,0,0.4)] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(255,149,0,0.4)] transition-all"
                                    >
                                        Next: Approve USDC
                                    </button>
                                </div>
                            )}

                            {executeStep === 2 && (
                                <div className="space-y-6">
                                    <h4 className="text-xl font-black text-[#0A4A7C]">Approve USDC</h4>

                                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#0A98FF] to-[#00FFF0] rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <p className="text-sm text-blue-800 font-semibold mb-2">
                                            Approve KITA Vault to use your USDC
                                        </p>
                                        <p className="text-xs text-blue-600">
                                            This is a one-time approval. You only need to do this once.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleApproveUSDC}
                                        disabled={isApproving}
                                        className="w-full bg-gradient-to-r from-[#0A98FF] to-[#00FFF0] text-white px-6 py-4 rounded-2xl font-bold shadow-[0_6px_0_0_rgba(10,152,255,0.4)] hover:shadow-[0_8px_0_0_rgba(10,152,255,0.4)] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(10,152,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isApproving ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Approving...
                                            </>
                                        ) : (
                                            'Approve USDC'
                                        )}
                                    </button>
                                </div>
                            )}

                            {executeStep === 3 && (
                                <div className="space-y-6">
                                    <h4 className="text-xl font-black text-[#0A4A7C]">Execute Order</h4>

                                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Zap className="w-8 h-8 text-white" />
                                        </div>
                                        <p className="text-sm text-green-800 font-semibold mb-2">
                                            Ready to execute!
                                        </p>
                                        <p className="text-xs text-green-600">
                                            You will receive {selectedOrder.premium} USDC premium instantly
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleExecute}
                                        disabled={isExecuting}
                                        className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-6 py-4 rounded-2xl font-bold shadow-[0_6px_0_0_rgba(5,150,105,0.4)] hover:shadow-[0_8px_0_0_rgba(5,150,105,0.4)] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(5,150,105,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isExecuting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Executing...
                                            </>
                                        ) : (
                                            <>
                                                Execute Order
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <ChatBot />
        </>
    );
}
