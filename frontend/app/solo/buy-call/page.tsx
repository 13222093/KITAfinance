'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { ArrowLeft, Zap, TrendingUp, AlertCircle, Target, Shield, DollarSign, Award } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function BuyCall() {
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('BTC');

  const strategyInfo = {
    name: 'Buy Call',
    title: 'Modal Receh, Potensi Jackpot',
    description: 'Beli opsi call untuk profit dari kenaikan harga dengan risiko terbatas. Modal kecil, potensi return besar jika prediksi tepat.',
    apy: '50-200%',
    risk: 'High',
    minInvestment: 500000,
  };

  const assets = [
    { symbol: 'BTC', name: 'Bitcoin', potentialReturn: '120-180%', strikePrice: '+15%' },
    { symbol: 'ETH', name: 'Ethereum', potentialReturn: '100-200%', strikePrice: '+20%' },
    { symbol: 'SOL', name: 'Solana', potentialReturn: '150-250%', strikePrice: '+25%' },
  ];

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

  const estimatedReturns = amount ? {
    conservative: parseFloat(amount) * 0.5,
    moderate: parseFloat(amount) * 1.2,
    aggressive: parseFloat(amount) * 2.0,
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
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-heading text-white mb-2">Tentang Strategi</h2>
                    <p className="text-body text-slate-300 mb-4">{strategyInfo.description}</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm font-semibold rounded-full">
                        Return {strategyInfo.apy}
                      </span>
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm font-semibold rounded-full">
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
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-purple-400" />
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
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
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
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-subheading text-red-400 mb-2">⚠️ High Risk Alert</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li>• Jika harga tidak naik melewati strike, premium hangus 100%</li>
                      <li>• Strategi spekulatif, cocok untuk risk taker</li>
                      <li>• Hanya gunakan dana yang siap loss</li>
                      <li>• Timing sangat penting, perhatikan expiry date</li>
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
                            ? 'bg-purple-500/20 border-2 border-purple-500'
                            : 'bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white">{asset.symbol}</span>
                          <span className="text-xs text-purple-400 font-semibold">{asset.potentialReturn}</span>
                        </div>
                        <p className="text-xs text-slate-400">{asset.name} • Strike {asset.strikePrice}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-white mb-2">Jumlah Premium</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="500.000"
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Minimal: Rp {(strategyInfo.minInvestment / 1000).toFixed(0)}rb</p>
                </div>

                {/* Estimated Returns */}
                {estimatedReturns && (
                  <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <h3 className="text-sm font-semibold text-purple-400 mb-3">Potensi Return</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Conservative</span>
                        <span className="text-white font-semibold">Rp {(estimatedReturns.conservative / 1000).toFixed(0)}rb</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Moderate</span>
                        <span className="text-purple-400 font-semibold">Rp {(estimatedReturns.moderate / 1000).toFixed(0)}rb</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Aggressive</span>
                        <span className="text-purple-400 font-semibold">Rp {(estimatedReturns.aggressive / 1000).toFixed(0)}rb</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  disabled={!amount || parseFloat(amount) < strategyInfo.minInvestment}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    amount && parseFloat(amount) >= strategyInfo.minInvestment
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Beli Call Option
                </button>

                <p className="text-xs text-center text-slate-400 mt-4">
                  🚀 Siap-siap jackpot kalau prediksi bener!
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
