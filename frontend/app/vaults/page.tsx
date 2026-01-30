'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { ArrowLeft, TrendingUp, Wallet, DollarSign, Award, Plus, ArrowUpRight, Sparkles, Trophy, Coins, Rocket, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Vaults() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Dummy data untuk vaults
  const vaults = [
    {
      id: 1,
      name: 'USDC Vault',
      strategy: 'Cash-Secured Put',
      balance: 7500000,
      apy: 8.5,
      status: 'Active',
      dailyYield: 1750,
      totalEarned: 525000,
      startDate: '10 Jan 2026',
    },
    {
      id: 2,
      name: 'USDT Vault',
      strategy: 'Covered Call',
      balance: 3000000,
      apy: 7.2,
      status: 'Active',
      dailyYield: 590,
      totalEarned: 295000,
      startDate: '12 Jan 2026',
    },
    {
      id: 3,
      name: 'DAI Vault',
      strategy: 'Cash-Secured Put',
      balance: 2000000,
      apy: 9.1,
      status: 'Active',
      dailyYield: 500,
      totalEarned: 150000,
      startDate: '15 Jan 2026',
    },
  ];

  const filteredVaults = filterStatus === 'all'
    ? vaults
    : vaults.filter(vault => vault.status.toLowerCase() === filterStatus);

  const totalBalance = vaults.reduce((sum, vault) => sum + vault.balance, 0);
  const totalEarned = vaults.reduce((sum, vault) => sum + vault.totalEarned, 0);
  const activeVaults = vaults.filter(v => v.status === 'Active').length;
  const avgAPY = vaults.filter(v => v.status === 'Active').reduce((sum, v) => sum + v.apy, 0) / activeVaults || 0;

  return (
    <>
      <Navbar />

      {/* HERO SECTION - Gradient Background */}
      <section className="relative min-h-[60vh] bg-gradient-to-br from-[#C15BFF] via-[#0A98FF] to-[#0A4A7C] pt-24 pb-12 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,152,255,0.3),transparent_50%)] animate-pulse" />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#FBFF2B] rounded-full blur-3xl opacity-20 animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#00FFF0] rounded-full blur-3xl opacity-15 animate-float-delayed" />
        </div>

        {/* Floating Icons - Portfolio Theme */}
        {/* Trophy - Top Right */}
        <div className="absolute top-20 right-8 md:right-20 animate-bounce" style={{ animationDelay: '0.2s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#FBFF2B] to-[#FFBC57] rounded-xl flex items-center justify-center shadow-xl rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Trophy className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Rocket - Top Left */}
        <div className="absolute top-32 left-12 md:left-24 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <div className="w-10 h-10 bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] rounded-lg flex items-center justify-center shadow-xl -rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Rocket className="w-5 h-5 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Shield - Bottom Left */}
        <div className="absolute bottom-16 left-8 md:left-16 animate-spin-slow">
          <div className="w-14 h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/40">
            <Shield className="w-7 h-7 text-white drop-shadow-lg" />
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
            <div className="flex-1">
              <div className="inline-block bg-gradient-to-r from-[#FBFF2B] to-[#FFBC57] text-white px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-lg">
                💼 PORTFOLIO
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-1">Semua Vault 🚀</h1>
              <p className="text-sm md:text-base text-white/80">Kelola semua vault dan posisi investasi kamu</p>
            </div>
          </div>

          {/* Summary Stats - Solid Gradient Cards */}
          <div className="overflow-hidden -mx-4 md:mx-0">
            <div className="flex gap-3 md:gap-4 px-4 md:px-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
              {/* Total Balance - Solid Gradient */}
              <div className="min-w-[200px] md:min-w-0 flex-shrink-0 snap-start bg-gradient-to-br from-[#00FFF0] via-[#0A98FF] to-[#0369a1] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl border-2 border-white/30 hover:scale-105 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                    <Wallet className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
                <p className="text-xs md:text-sm font-bold text-white/80 mb-1">Total Balance</p>
                <p className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">
                  Rp {(totalBalance / 1000000).toFixed(1)}jt
                </p>
              </div>

              {/* Total Earned - Solid Gradient */}
              <div className="min-w-[200px] md:min-w-0 flex-shrink-0 snap-start bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl border-2 border-white/30 hover:scale-105 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
                <p className="text-xs md:text-sm font-bold text-white/80 mb-1">Total Earned</p>
                <p className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">
                  Rp {(totalEarned / 1000000).toFixed(1)}jt
                </p>
              </div>

              {/* Active Vaults */}
              <div className="min-w-[200px] md:min-w-0 flex-shrink-0 snap-start bg-gradient-to-br from-[#C15BFF] via-[#A855F7] to-[#7C3AED] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl border-2 border-white/30 hover:scale-105 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
                <p className="text-xs md:text-sm font-bold text-white/80 mb-1">Active Vaults</p>
                <p className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">{activeVaults}</p>
              </div>

              {/* Avg APY */}
              <div className="min-w-[200px] md:min-w-0 flex-shrink-0 snap-start bg-gradient-to-br from-[#FFBC57] via-[#FF9500] to-[#F97316] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl border-2 border-white/30 hover:scale-105 hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
                <p className="text-xs md:text-sm font-bold text-white/80 mb-1">Avg APY</p>
                <p className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">{avgAPY.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VAULTS SECTION - White Background */}
      <section className="relative py-12 md:py-16 bg-white overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #0A4A7C 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* Floating Icons - Vault Theme */}
        {/* Coins - Top Right */}
        <div className="absolute top-12 right-8 md:right-20 animate-spin-slow">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm border-2 border-orange-200">
            <Coins className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Sparkles - Top Left */}
        <div className="absolute top-16 left-8 md:left-16 animate-pulse" style={{ animationDelay: '0.4s' }}>
          <div className="w-10 h-10 bg-gradient-to-br from-[#C15BFF] to-[#A855F7] rounded-lg flex items-center justify-center shadow-xl rotate-12 backdrop-blur-sm border-2 border-purple-200">
            <Sparkles className="w-5 h-5 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Zap - Bottom Right */}
        <div className="absolute bottom-12 right-8 md:right-16 animate-bounce" style={{ animationDelay: '0.7s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] rounded-xl flex items-center justify-center shadow-xl -rotate-12 backdrop-blur-sm border-2 border-cyan-200">
            <Zap className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 space-y-6 md:space-y-8">
          {/* Filter Tabs - White Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-2 shadow-xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`flex-1 py-2.5 md:py-3 px-3 md:px-6 rounded-xl font-bold text-sm md:text-base transition-all ${filterStatus === 'all'
                  ? 'bg-gradient-to-r from-[#00FFF0] to-[#0A98FF] text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                Semua ({vaults.length})
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`flex-1 py-2.5 md:py-3 px-3 md:px-6 rounded-xl font-bold text-sm md:text-base transition-all ${filterStatus === 'active'
                  ? 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                Active ({vaults.filter(v => v.status === 'Active').length})
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`flex-1 py-2.5 md:py-3 px-3 md:px-6 rounded-xl font-bold text-sm md:text-base transition-all ${filterStatus === 'inactive'
                  ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                Inactive ({vaults.filter(v => v.status === 'Inactive').length})
              </button>
            </div>
          </div>

          {/* Vault List - White Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {filteredVaults.map((vault, index) => {
              const gradientConfigs = [
                { bg: 'from-[#C15BFF] to-[#9333EA]', border: 'border-purple-200' },
                { bg: 'from-[#00FFF0] to-[#0A98FF]', border: 'border-cyan-200' },
                { bg: 'from-[#FFBC57] to-[#FF9500]', border: 'border-orange-200' },
              ];
              const config = gradientConfigs[index % 3];

              return (
                <div
                  key={vault.id}
                  className="group bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-gray-200 hover:border-gray-300 hover:scale-[1.02] hover:-translate-y-1 transition-all cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                      <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${config.bg} rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform flex-shrink-0`}>
                        {vault.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl md:text-2xl font-black text-[#0A4A7C] mb-1 truncate">{vault.name}</h3>
                        <p className="text-sm md:text-base text-gray-600 font-semibold">{vault.strategy}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 md:px-3 py-1 md:py-1.5 text-xs font-bold rounded-full shadow-md flex-shrink-0 ml-2 ${vault.status === 'Active'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                      {vault.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1 font-semibold">Balance</p>
                      <p className="text-base md:text-lg font-black text-[#0A4A7C]">Rp {(vault.balance / 1000000).toFixed(1)}jt</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1 font-semibold">APY</p>
                      <p className="text-base md:text-lg font-black text-green-600">{vault.apy}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1 font-semibold">Daily Yield</p>
                      <p className="text-base md:text-lg font-black text-[#00FFF0]">Rp {(vault.dailyYield / 1000).toFixed(1)}rb</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1 font-semibold">Total Earned</p>
                      <p className="text-base md:text-lg font-black text-[#FFBC57]">Rp {(vault.totalEarned / 1000000).toFixed(1)}jt</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t-2 border-gray-200 flex items-center justify-between">
                    <span className="text-xs md:text-sm font-bold text-gray-500">Dimulai {vault.startDate}</span>
                    <button className="flex items-center gap-2 text-sm md:text-base text-[#0A98FF] hover:text-[#00FFF0] font-black group-hover:gap-3 transition-all">
                      Detail
                      <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add Vault Card */}
            <Link
              href="/dashboard"
              className="group bg-white rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-xl border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-4 min-h-[280px] md:min-h-[320px]"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Plus className="w-8 h-8 md:w-10 md:h-10 text-gray-600" />
              </div>
              <div className="text-center">
                <p className="font-black text-[#0A4A7C] text-lg md:text-xl mb-1">Tambah Vault Baru</p>
                <p className="text-sm md:text-base text-gray-600">Mulai strategi investasi baru</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <ChatBot />
    </>
  );
}
