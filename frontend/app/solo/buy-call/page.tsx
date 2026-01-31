'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { ArrowLeft, Zap, TrendingUp, AlertCircle, Target, Shield, DollarSign, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function BuyCall() {
  // USDC to Rupiah conversion
  const USDC_TO_IDR = 15800;
  const toRupiah = (usdc: number) => (usdc * USDC_TO_IDR).toLocaleString('id-ID');

  // Mock realistic orders (Buy Call = isCall:true, isLong:true)
  const mockOrders = [
    {
      asset: 'BTC',
      strikePrice: '105000',
      premium: '850',
      expiry: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      apy: '145',
      potentialReturn: '180%',
      currentPrice: '98500'
    },
    {
      asset: 'ETH',
      strikePrice: '3800',
      premium: '125',
      expiry: Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60), // 14 days
      apy: '128',
      potentialReturn: '165%',
      currentPrice: '3520'
    },
    {
      asset: 'BTC',
      strikePrice: '110000',
      premium: '620',
      expiry: Math.floor(Date.now() / 1000) + (5 * 24 * 60 * 60), // 5 days
      apy: '168',
      potentialReturn: '220%',
      currentPrice: '98500'
    },
    {
      asset: 'ETH',
      strikePrice: '4000',
      premium: '95',
      expiry: Math.floor(Date.now() / 1000) + (10 * 24 * 60 * 60), // 10 days
      apy: '112',
      potentialReturn: '145%',
      currentPrice: '3520'
    },
  ];

  const [selectedAsset, setSelectedAsset] = useState('all');

  const strategyInfo = {
    name: 'Buy Call',
    title: 'Modal Receh, Potensi Jackpot',
    description: 'Beli opsi call untuk profit dari kenaikan harga dengan risiko terbatas. Modal kecil, potensi return besar jika prediksi tepat.',
    apy: '50-200%',
    risk: 'High',
  };

  const benefits = [
    { icon: Zap, title: 'Modal Kecil', description: 'Cukup bayar premium, tidak perlu beli aset penuh' },
    { icon: Target, title: 'Unlimited Upside', description: 'Profit tidak terbatas jika harga naik tinggi' },
    { icon: Shield, title: 'Limited Risk', description: 'Maksimal loss hanya sebesar premium yang dibayar' },
    { icon: Award, title: 'High Leverage', description: 'Return bisa jauh lebih besar dari investasi awal' },
  ];

  const howItWorks = [
    { step: 1, title: 'Pilih Aset & Strike', description: 'Tentukan aset dan harga target (strike price)' },
    { step: 2, title: 'Bayar Premium', description: 'Bayar premium untuk hak beli di harga strike' },
    { step: 3, title: 'Tunggu Expiry', description: 'Jika harga naik melewati strike, kamu profit' },
    { step: 4, title: 'Exercise atau Jual', description: 'Exercise opsi untuk profit, atau jual sebelum expiry' },
  ];

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
          {/* Header */}
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <Link
              href="/dashboard"
              className="group w-12 h-12 md:w-14 md:h-14 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-[#0A4A7C] group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-1 shadow-md">
                STRATEGI
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">{strategyInfo.title}</h1>
              <p className="text-sm md:text-base text-white/90 font-medium">{strategyInfo.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Strategy Overview */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white/50">
                <div className="flex items-start gap-4 md:gap-6 mb-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform flex-shrink-0">
                    <Zap className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-black text-[#0A4A7C] mb-2">Tentang Strategi</h2>
                    <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed mb-4 md:mb-6">{strategyInfo.description}</p>
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                      <span className="px-3 md:px-4 py-1.5 md:py-2 bg-purple-100 text-purple-700 font-bold text-xs md:text-sm rounded-xl border border-purple-200">
                        Return {strategyInfo.apy}
                      </span>
                      <span className="px-3 md:px-4 py-1.5 md:py-2 bg-red-100 text-red-700 font-bold text-xs md:text-sm rounded-xl border border-red-200">
                        Risk: {strategyInfo.risk}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white/50">
                <h2 className="text-xl md:text-2xl font-black text-[#0A4A7C] mb-4 md:mb-8">Keuntungan Strategi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-purple-50 rounded-xl md:rounded-2xl border border-purple-100 hover:bg-purple-100 transition-colors">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-200 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-purple-700" />
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

              {/* How It Works */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white/50">
                <h2 className="text-xl md:text-2xl font-black text-[#0A4A7C] mb-4 md:mb-8">Cara Kerja</h2>
                <div className="space-y-4 md:space-y-6">
                  {howItWorks.map((item) => (
                    <div key={item.step} className="flex items-start gap-3 md:gap-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg flex-shrink-0">
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

              {/* Risk Warning */}
              <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-black text-red-700 mb-2 text-lg">⚠️ High Risk Alert</h3>
                    <ul className="space-y-2 text-sm text-red-800 font-medium">
                      <li>• Jika harga tidak naik melewati strike, premium hangus 100%</li>
                      <li>• Strategi spekulatif, cocok untuk risk taker</li>
                      <li>• Hanya gunakan dana yang siap loss</li>
                      <li>• Timing sangat penting, perhatikan expiry date</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ORDER SELECTION SECTION */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white/50">
              <h2 className="text-xl md:text-2xl font-black text-[#0A4A7C] mb-2">Pilih Order Kamu</h2>
              <p className="text-sm md:text-base text-gray-600 font-medium mb-4 md:mb-6">Order call option dengan potensi return tinggi. Harga dalam USDC, konversi Rupiah otomatis.</p>

              {/* Asset Filter */}
              <div className="flex gap-2 md:gap-3 mb-6 md:mb-8 flex-wrap">
                <button
                  onClick={() => setSelectedAsset('all')}
                  className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all ${selectedAsset === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Semua ({mockOrders.length})
                </button>
                <button
                  onClick={() => setSelectedAsset('BTC')}
                  className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all ${selectedAsset === 'BTC'
                    ? 'bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Bitcoin ₿
                </button>
                <button
                  onClick={() => setSelectedAsset('ETH')}
                  className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm transition-all ${selectedAsset === 'ETH'
                    ? 'bg-gradient-to-r from-[#A855F7] to-[#9333EA] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  Ethereum Ξ
                </button>
              </div>

              {/* Order Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {mockOrders
                  .filter(order => selectedAsset === 'all' || order.asset === selectedAsset)
                  .map((order, index) => {
                    const gradientConfigs = [
                      { border: 'border-purple-300', badge: 'bg-purple-100 text-purple-700 border-purple-300' },
                      { border: 'border-pink-300', badge: 'bg-pink-100 text-pink-700 border-pink-300' },
                      { border: 'border-fuchsia-300', badge: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300' },
                    ];
                    const config = gradientConfigs[index % 3];
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
                          <span className="text-[10px] md:text-xs text-gray-500 font-semibold">Buy Call</span>
                        </div>

                        <div className="mb-3 md:mb-4">
                          <p className="text-[10px] md:text-xs text-gray-600 mb-0.5 md:mb-1 font-semibold">Harga Target (Strike)</p>
                          <p className="text-2xl md:text-3xl font-black text-[#0A4A7C]">
                            ${parseFloat(order.strikePrice).toLocaleString()}
                          </p>
                          <p className="text-[10px] md:text-xs text-gray-500 font-medium mt-0.5 md:mt-1">
                            ≈ Rp {toRupiah(parseFloat(order.strikePrice))}
                          </p>
                          <p className="text-[10px] md:text-xs text-purple-600 font-bold mt-1">
                            Harga Sekarang: ${parseFloat(order.currentPrice).toLocaleString()}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
                          <div className="bg-purple-50 rounded-lg md:rounded-xl p-2 md:p-3 border-2 border-purple-200">
                            <p className="text-[10px] md:text-xs text-purple-700 mb-0.5 md:mb-1 font-bold">💰 Premium</p>
                            <p className="text-sm md:text-base font-black text-purple-600">{premium.toFixed(0)} USDC</p>
                            <p className="text-[10px] md:text-xs text-purple-600 font-medium">≈ Rp {toRupiah(premium)}</p>
                          </div>
                          <div className="bg-pink-50 rounded-lg md:rounded-xl p-2 md:p-3 border-2 border-pink-200">
                            <p className="text-[10px] md:text-xs text-pink-700 mb-0.5 md:mb-1 font-bold">📈 Return</p>
                            <p className="text-sm md:text-base font-black text-pink-600">{order.potentialReturn}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg md:rounded-xl p-2 md:p-3 border-2 border-gray-200">
                            <p className="text-[10px] md:text-xs text-gray-600 mb-0.5 md:mb-1 font-semibold">APY</p>
                            <p className="text-sm md:text-base font-black text-gray-700">{order.apy}%</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg md:rounded-xl p-2 md:p-3 border-2 border-gray-200">
                            <p className="text-[10px] md:text-xs text-gray-600 mb-0.5 md:mb-1 font-semibold">Deadline</p>
                            <p className="text-xs md:text-sm font-black text-gray-700">
                              {new Date(order.expiry * 1000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>

                        <button
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-sm md:text-base font-bold shadow-[0_4px_0_0_rgba(168,85,247,0.4)] md:shadow-[0_6px_0_0_rgba(168,85,247,0.4)] hover:shadow-[0_6px_0_0_rgba(168,85,247,0.4)] md:hover:shadow-[0_8px_0_0_rgba(168,85,247,0.4)] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2"
                        >
                          Beli Call Ini
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </>
  );
}
