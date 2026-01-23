'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { ArrowLeft, Wallet, TrendingUp, AlertCircle, Shield, DollarSign, Target } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CoveredCall() {
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('ETH');

  const strategyInfo = {
    name: 'Covered Call Vault',
    title: 'Nabung Aset Dapat Bunga',
    description: 'Hasilkan yield dari aset yang kamu punya dengan strategi covered call. Cocok untuk long-term holder yang mau dapat passive income.',
    apy: '6-10%',
    risk: 'Low',
    minInvestment: 2000000,
  };

  const assets = [
    { symbol: 'ETH', name: 'Ethereum', currentAPY: 7.8, available: true },
    { symbol: 'BTC', name: 'Bitcoin', currentAPY: 6.5, available: true },
    { symbol: 'SOL', name: 'Solana', currentAPY: 9.2, available: true },
  ];

  const benefits = [
    { icon: Wallet, title: 'Passive Income', description: 'Aset tetap di tanganmu sambil dapat yield rutin' },
    { icon: Shield, title: 'Low Risk', description: 'Risiko paling rendah karena aset tetap dalam genggaman' },
    { icon: DollarSign, title: 'Premium Konsisten', description: 'Terima premium setiap kali jual covered call' },
    { icon: TrendingUp, title: 'Yield Stabil', description: 'Return konsisten cocok untuk long-term holder' },
  ];

  const howItWorks = [
    { step: 1, title: 'Deposit Aset', description: 'Masukkan aset crypto yang ingin kamu hold' },
    { step: 2, title: 'Jual Call Option', description: 'Sistem otomatis jual call option di atas harga pasar' },
    { step: 3, title: 'Terima Premium', description: 'Dapat premium sebagai passive income bulanan' },
    { step: 4, title: 'Aset Tetap Aman', description: 'Jika harga tidak naik drastis, aset tetap di tanganmu' },
  ];

  const estimatedReturns = amount ? {
    monthly: parseFloat(amount) * 0.006,
    yearly: parseFloat(amount) * 0.072,
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
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-heading text-white mb-2">Tentang Strategi</h2>
                    <p className="text-body text-slate-300 mb-4">{strategyInfo.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full">
                        APY {strategyInfo.apy}
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full">
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
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-green-400" />
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
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
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
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-subheading text-green-400 mb-2">Info Penting</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Jika harga naik drastis melewati strike, aset akan terjual</li>
                      <li>• Kamu tetap dapat premium meski aset terjual</li>
                      <li>• Cocok untuk yang yakin harga tidak akan pump terlalu tinggi</li>
                      <li>• Strategi terbaik untuk long-term holder yang mau passive income</li>
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
                            ? 'bg-green-500/20 border-2 border-green-500'
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
                      placeholder="2.000.000"
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Minimal: Rp {(strategyInfo.minInvestment / 1000000).toFixed(1)}jt</p>
                </div>

                {/* Estimated Returns */}
                {estimatedReturns && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <h3 className="text-sm font-semibold text-green-400 mb-3">Estimasi Return</h3>
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
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                      : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Mulai Investasi
                </button>

                <p className="text-xs text-center text-slate-400 mt-4">
                  Aset akan masuk ke Covered Call Vault
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
