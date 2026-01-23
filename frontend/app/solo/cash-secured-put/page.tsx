'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { ArrowLeft, DollarSign, TrendingUp, AlertCircle, CheckCircle, Calendar, Target, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CashSecuredPut() {
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('USDC');

  const strategyInfo = {
    name: 'Cash-Secured Put',
    title: 'Beli Murah Dapat Cashback',
    description: 'Dapat premium dengan menjual opsi put. Cocok untuk beli aset di harga lebih murah dengan risiko yang terukur.',
    apy: '8-12%',
    risk: 'Medium',
    minInvestment: 1000000,
  };

  const assets = [
    { symbol: 'USDC', name: 'USD Coin', currentAPY: 8.5, available: true },
    { symbol: 'USDT', name: 'Tether', currentAPY: 8.2, available: true },
    { symbol: 'DAI', name: 'Dai Stablecoin', currentAPY: 9.1, available: true },
  ];

  const benefits = [
    { icon: DollarSign, title: 'Premium Income', description: 'Dapatkan premium langsung saat menjual opsi put' },
    { icon: Target, title: 'Beli Lebih Murah', description: 'Kesempatan membeli aset di harga strike yang lebih rendah' },
    { icon: Shield, title: 'Risiko Terukur', description: 'Maksimal loss sudah diketahui sejak awal (strike price)' },
    { icon: TrendingUp, title: 'APY Stabil', description: 'Yield konsisten dari premium yang diterima' },
  ];

  const howItWorks = [
    { step: 1, title: 'Pilih Aset & Jumlah', description: 'Tentukan aset yang ingin kamu beli dan jumlah investasi' },
    { step: 2, title: 'Jual Opsi Put', description: 'Sistem menjual opsi put dengan strike price di bawah harga pasar' },
    { step: 3, title: 'Terima Premium', description: 'Langsung dapat premium sebagai income pasif' },
    { step: 4, title: 'Exercise atau Expire', description: 'Jika harga turun di bawah strike, kamu beli aset lebih murah. Jika tidak, premium jadi profit' },
  ];

  const estimatedReturns = amount ? {
    monthly: parseFloat(amount) * 0.008,
    yearly: parseFloat(amount) * 0.096,
  } : null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 px-4 pb-24">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard"
              className="w-10 h-10 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div>
              <h1 className="text-ultra-heading text-white">{strategyInfo.title}</h1>
              <p className="text-body text-slate-300">{strategyInfo.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Strategy Overview */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-heading text-white mb-2">Tentang Strategi</h2>
                    <p className="text-body text-slate-300 mb-4">{strategyInfo.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full">
                        APY {strategyInfo.apy}
                      </span>
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm font-semibold rounded-full">
                        Risk: {strategyInfo.risk}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-heading text-white mb-6">Keuntungan Strategi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-xl">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-subheading text-white mb-1">{benefit.title}</h3>
                          <p className="text-sm text-slate-400">{benefit.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-heading text-white mb-6">Cara Kerja</h2>
                <div className="space-y-4">
                  {howItWorks.map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-subheading text-white mb-1">{item.title}</h3>
                        <p className="text-body text-slate-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Warning */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-subheading text-yellow-400 mb-2">Perhatian</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Kamu wajib beli aset jika harga turun di bawah strike price</li>
                      <li>• Maksimal profit terbatas pada premium yang diterima</li>
                      <li>• Pastikan kamu siap hold aset jangka panjang jika ter-exercise</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Investment Form */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sticky top-24">
                <h2 className="text-heading text-white mb-6">Mulai Investasi</h2>

                {/* Asset Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-white mb-3">Pilih Aset</label>
                  <div className="space-y-2">
                    {assets.map((asset) => (
                      <button
                        key={asset.symbol}
                        onClick={() => setSelectedAsset(asset.symbol)}
                        className={`w-full p-4 rounded-xl transition-all text-left ${
                          selectedAsset === asset.symbol
                            ? 'bg-blue-500/20 border-2 border-blue-500'
                            : 'bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white">{asset.symbol}</span>
                          <span className="text-xs text-green-400 font-semibold">{asset.currentAPY}% APY</span>
                        </div>
                        <p className="text-xs text-slate-400">{asset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-white mb-2">Jumlah Investasi</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1.000.000"
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Minimal: Rp {(strategyInfo.minInvestment / 1000000).toFixed(1)}jt</p>
                </div>

                {/* Estimated Returns */}
                {estimatedReturns && (
                  <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <h3 className="text-sm font-semibold text-blue-400 mb-3">Estimasi Return</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Per Bulan</span>
                        <span className="text-white font-semibold">Rp {(estimatedReturns.monthly / 1000).toFixed(0)}rb</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Per Tahun</span>
                        <span className="text-white font-semibold">Rp {(estimatedReturns.yearly / 1000000).toFixed(1)}jt</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  disabled={!amount || parseFloat(amount) < strategyInfo.minInvestment}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    amount && parseFloat(amount) >= strategyInfo.minInvestment
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Mulai Investasi
                </button>

                <p className="text-xs text-center text-slate-400 mt-4">
                  Dana akan langsung dialokasikan ke strategi Cash-Secured Put
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </>
  );
}
