'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { ArrowLeft, DollarSign, TrendingUp, CheckCircle, Target, Shield, Loader2, X, ArrowRight, Zap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CashSecuredPut() {
  // USDC to Rupiah conversion rate (approximate)
  const USDC_TO_IDR = 15800;

  // Orders state
  const [filterAsset, setFilterAsset] = useState<'all' | 'BTC' | 'ETH'>('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [executeStep, setExecuteStep] = useState(1);
  const [isApproving, setIsApproving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Helper function to convert USDC to Rupiah
  const toRupiah = (usdc: number) => {
    return (usdc * USDC_TO_IDR).toLocaleString('id-ID');
  };

  const strategyInfo = {
    name: 'Cash-Secured Put',
    title: 'Beli Murah Dapat Cashback',
    description: 'Pasang harga beli yang kamu mau. Kalau harga turun sampai target kamu, kamu beli murah. Kalau nggak turun, cashback jadi profit!',
    apy: '8-12%',
    risk: 'Medium',
  };

  const benefits = [
    { icon: DollarSign, title: 'Cashback Instant', description: 'Dapat cashback langsung saat pasang antrian beli' },
    { icon: Target, title: 'Beli Lebih Murah', description: 'Kesempatan beli crypto di harga target yang lebih rendah' },
    { icon: Shield, title: 'Risiko Jelas', description: 'Tau dari awal berapa maksimal yang bisa dibeli' },
    { icon: TrendingUp, title: 'Win-Win', description: 'Harga turun = beli murah, harga naik = cashback jadi profit' },
  ];

  const howItWorks = [
    { step: 1, title: 'Pilih Order', description: 'Pilih crypto dan harga target yang kamu mau dari order yang tersedia' },
    { step: 2, title: 'Dapat Cashback Instant', description: 'Langsung terima cashback/premium saat order aktif' },
    { step: 3, title: 'Tunggu Hasil', description: 'Kalau harga turun sampai target, kamu beli murah. Kalau nggak turun, cashback jadi profit!' },
  ];

  // Fetch real orders from Thetanuts
  useEffect(() => {
    fetchOrders();
  }, [filterAsset]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
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
      setIsLoadingOrders(false);
    }
  };

  const handleExecuteOrder = (order: any) => {
    setSelectedOrder(order);
    setShowExecuteModal(true);
    setExecuteStep(1);
  };

  const handleApproveUSDC = async () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setExecuteStep(3);
    }, 2000);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setShowExecuteModal(false);
      window.location.href = '/dashboard';
    }, 2000);
  };

  // Filter orders based on selected asset
  const filteredOrders = filterAsset === 'all' ? orders : orders.filter(o => o.asset === filterAsset);
  const totalOrders = filteredOrders.length;
  const bestAPY = filteredOrders.length > 0 ? Math.max(...filteredOrders.map(o => parseFloat(o.apy || '0'))) : 0;

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gradient-to-br from-[#0A4A7C] via-[#0A98FF] to-[#04877f] pt-24 px-4 pb-24 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,152,255,0.3),transparent_50%)] animate-pulse" />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#C15BFF] rounded-full blur-3xl opacity-30 animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FBFF2B] rounded-full blur-3xl opacity-20 animate-float-delayed" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#00FFF0] rounded-full blur-3xl opacity-25 animate-float-slow" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/dashboard" className="group w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-2xl flex items-center justify-center shadow-xl hover:bg-white/20 hover:scale-105 hover:-translate-y-1 transition-all">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <div className="inline-block bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white px-3 py-1 rounded-full text-xs font-bold mb-1 shadow-md">
                STRATEGI
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                {strategyInfo.title} 💰
              </h1>
              <p className="text-sm md:text-base text-white/90 font-medium mt-1">
                Cash-Secured Put
              </p>
            </div>
          </div>

          {/* Tentang Strategi Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white/50">
            <div className="flex items-start gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#FFBC57] to-[#FF9500] rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform flex-shrink-0">
                <DollarSign className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-black text-[#0A4A7C] mb-2">Tentang Strategi</h2>
                <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed mb-4">
                  {strategyInfo.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <span className="px-3 md:px-4 py-1.5 md:py-2 bg-orange-100 text-orange-700 font-bold text-xs md:text-sm rounded-xl border border-orange-200">
                    APY {strategyInfo.apy}
                  </span>
                  <span className="px-3 md:px-4 py-1.5 md:py-2 bg-orange-100 text-orange-700 font-bold text-xs md:text-sm rounded-xl border border-orange-200">
                    Risk: {strategyInfo.risk}
                  </span>
                  <span className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 text-blue-700 font-bold text-xs md:text-sm rounded-xl border border-blue-200">
                    {totalOrders} Order Tersedia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits - Compact for Mobile */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white/50">
            <h2 className="text-xl md:text-2xl font-black text-[#0A4A7C] mb-4 md:mb-6">Keuntungan Strategi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-[#0A4A7C] mb-0.5 md:mb-1">{benefit.title}</h3>
                      <p className="text-xs md:text-sm text-gray-500 font-medium">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How It Works - Compact for Mobile */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white/50">
            <h2 className="text-xl md:text-2xl font-black text-[#0A4A7C] mb-4 md:mb-6">Cara Kerja</h2>
            <div className="space-y-4 md:space-y-6">
              {howItWorks.map((item) => (
                <div key={item.step} className="flex items-start gap-3 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#C15BFF] to-[#0A98FF] rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="flex-1 pt-0.5 md:pt-1">
                    <h3 className="text-sm md:text-lg font-bold text-[#0A4A7C] mb-0.5 md:mb-1">{item.title}</h3>
                    <p className="text-xs md:text-base text-gray-600 font-medium">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER SELECTION SECTION */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white/50">
            <h2 className="text-xl md:text-2xl font-black text-[#0A4A7C] mb-2">Pilih Order Kamu</h2>
            <p className="text-sm md:text-base text-gray-600 font-medium mb-4 md:mb-6">Order real-time dari Thetanuts V4. Harga dalam USDC, konversi Rupiah otomatis.</p>

            {/* Asset Filter - Mobile Optimized */}
            <div className="flex gap-2 md:gap-3 mb-6 md:mb-8 flex-wrap">
              <button
                onClick={() => setFilterAsset('all')}
                className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all ${filterAsset === 'all'
                  ? 'bg-gradient-to-r from-[#00FFF0] to-[#0A98FF] text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Semua ({orders.length})
              </button>
              <button
                onClick={() => setFilterAsset('BTC')}
                className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all ${filterAsset === 'BTC'
                  ? 'bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Bitcoin ₿
              </button>
              <button
                onClick={() => setFilterAsset('ETH')}
                className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all ${filterAsset === 'ETH'
                  ? 'bg-gradient-to-r from-[#A855F7] to-[#9333EA] text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Ethereum Ξ
              </button>
            </div>

            {/* Orders Grid */}
            {isLoadingOrders ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-[#0A98FF] animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">Loading orders...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-xl font-bold text-gray-600 mb-2">Belum ada order tersedia</p>
                <p className="text-gray-500">Coba pilih aset lain atau cek lagi nanti</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order, index) => {
                  const gradientConfigs = [
                    { border: 'border-purple-300', badge: 'bg-purple-100 text-purple-700 border-purple-300' },
                    { border: 'border-cyan-300', badge: 'bg-cyan-100 text-cyan-700 border-cyan-300' },
                    { border: 'border-orange-300', badge: 'bg-orange-100 text-orange-700 border-orange-300' },
                  ];
                  const config = gradientConfigs[index % 3];
                  const collateral = parseFloat(order.collateralRequired);
                  const premium = parseFloat(order.premium);

                  return (
                    <div
                      key={index}
                      className={`group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 md:p-6 shadow-xl border-3 md:border-4 ${config.border} hover:scale-[1.02] hover:-translate-y-1 transition-all`}
                    >
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <span className={`px-2.5 md:px-3 py-1 md:py-1.5 text-xs font-bold rounded-full border-2 ${config.badge}`}>
                          {order.asset}
                        </span>
                        <span className="text-[10px] md:text-xs text-gray-500 font-semibold">Cash-Secured Put</span>
                      </div>

                      <div className="mb-3 md:mb-4">
                        <p className="text-[10px] md:text-xs text-gray-600 mb-0.5 md:mb-1 font-semibold">Harga Target Beli</p>
                        <p className="text-2xl md:text-3xl font-black text-[#0A4A7C]">
                          ${parseFloat(order.strikePrice).toLocaleString()}
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-500 font-medium mt-0.5 md:mt-1">
                          ≈ Rp {toRupiah(parseFloat(order.strikePrice))}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
                        <div className="bg-green-50 rounded-lg md:rounded-xl p-2 md:p-3 border-2 border-green-200">
                          <p className="text-[10px] md:text-xs text-green-700 mb-0.5 md:mb-1 font-bold">💰 Cashback</p>
                          <p className="text-sm md:text-base font-black text-green-600">{premium.toFixed(2)} USDC</p>
                          <p className="text-[10px] md:text-xs text-green-600 font-medium">≈ Rp {toRupiah(premium)}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg md:rounded-xl p-2 md:p-3 border-2 border-blue-200">
                          <p className="text-[10px] md:text-xs text-blue-700 mb-0.5 md:mb-1 font-bold">📈 APY</p>
                          <p className="text-sm md:text-base font-black text-blue-600">{order.apy || '8.5'}%</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg md:rounded-xl p-2 md:p-3 border-2 border-gray-200">
                          <p className="text-[10px] md:text-xs text-gray-600 mb-0.5 md:mb-1 font-semibold">Modal Perlu</p>
                          <p className="text-xs md:text-sm font-black text-gray-700">{collateral.toFixed(0)} USDC</p>
                          <p className="text-[10px] md:text-xs text-gray-500 font-medium">≈ Rp {toRupiah(collateral)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg md:rounded-xl p-2 md:p-3 border-2 border-gray-200">
                          <p className="text-[10px] md:text-xs text-gray-600 mb-0.5 md:mb-1 font-semibold">Deadline</p>
                          <p className="text-xs md:text-sm font-black text-gray-700">
                            {new Date(order.expiry * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleExecuteOrder(order)}
                        className="w-full bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-sm md:text-base font-bold shadow-[0_4px_0_0_rgba(255,149,0,0.4)] md:shadow-[0_6px_0_0_rgba(255,149,0,0.4)] hover:shadow-[0_6px_0_0_rgba(255,149,0,0.4)] md:hover:shadow-[0_8px_0_0_rgba(255,149,0,0.4)] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(255,149,0,0.4)] transition-all flex items-center justify-center gap-2"
                      >
                        Ambil Order Ini
                        <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EXECUTE ORDER MODAL */}
      {showExecuteModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExecuteModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0A4A7C] to-[#0284C7] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white">Konfirmasi Order</h3>
                <button onClick={() => setShowExecuteModal(false)} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/30 transition-all">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex-1 flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${executeStep >= step ? 'bg-white text-[#0A4A7C]' : 'bg-white/20 text-white/60'}`}>
                      {executeStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                    </div>
                    {step < 3 && <div className={`flex-1 h-1 rounded ${executeStep > step ? 'bg-white' : 'bg-white/20'}`} />}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 md:p-8">
              {executeStep === 1 && (
                <div className="space-y-6">
                  <h4 className="text-xl font-black text-[#0A4A7C]">Detail Order</h4>
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-semibold">Aset</span>
                      <span className="font-black text-[#0A4A7C]">{selectedOrder.asset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-semibold">Harga Target</span>
                      <div className="text-right">
                        <span className="font-black text-[#0A4A7C] block">${parseFloat(selectedOrder.strikePrice).toLocaleString()}</span>
                        <span className="text-xs text-gray-500">≈ Rp {toRupiah(parseFloat(selectedOrder.strikePrice))}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-semibold">Cashback Kamu</span>
                      <div className="text-right">
                        <span className="font-black text-green-600 block">{selectedOrder.premium} USDC</span>
                        <span className="text-xs text-green-600">≈ Rp {toRupiah(parseFloat(selectedOrder.premium))}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-semibold">Modal Diperlukan</span>
                      <div className="text-right">
                        <span className="font-black text-[#0A4A7C] block">{selectedOrder.collateralRequired} USDC</span>
                        <span className="text-xs text-gray-500">≈ Rp {toRupiah(parseFloat(selectedOrder.collateralRequired))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                    <p className="text-sm text-green-800 font-semibold">
                      ✅ Kamu akan terima <span className="font-black">{selectedOrder.premium} USDC</span> cashback langsung!
                    </p>
                  </div>
                  <button onClick={() => setExecuteStep(2)} className="w-full bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white px-6 py-4 rounded-2xl font-bold shadow-[0_6px_0_0_rgba(255,149,0,0.4)] hover:shadow-[0_8px_0_0_rgba(255,149,0,0.4)] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(255,149,0,0.4)] transition-all">
                    Lanjut: Approve USDC
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
                    <p className="text-sm text-blue-800 font-semibold mb-2">Izinkan KITA Vault pakai USDC kamu</p>
                    <p className="text-xs text-blue-600">Cukup sekali aja, nggak perlu approve lagi next time</p>
                  </div>
                  <button onClick={handleApproveUSDC} disabled={isApproving} className="w-full bg-gradient-to-r from-[#0A98FF] to-[#00FFF0] text-white px-6 py-4 rounded-2xl font-bold shadow-[0_6px_0_0_rgba(10,152,255,0.4)] hover:shadow-[0_8px_0_0_rgba(10,152,255,0.4)] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(10,152,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
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
                  <h4 className="text-xl font-black text-[#0A4A7C]">Eksekusi Order</h4>
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-green-800 font-semibold mb-2">Siap eksekusi!</p>
                    <p className="text-xs text-green-600">Kamu akan terima {selectedOrder.premium} USDC cashback instant</p>
                  </div>
                  <button onClick={handleExecute} disabled={isExecuting} className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-6 py-4 rounded-2xl font-bold shadow-[0_6px_0_0_rgba(5,150,105,0.4)] hover:shadow-[0_8px_0_0_rgba(5,150,105,0.4)] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(5,150,105,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {isExecuting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        Eksekusi Order
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
