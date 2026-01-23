'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { ArrowLeft, TrendingUp, Wallet, DollarSign, Award, Plus, ArrowUpRight } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 px-4 pb-24">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard"
              className="w-10 h-10 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div className="flex-1">
              <h1 className="text-ultra-heading text-white">Semua Vault</h1>
              <p className="text-body text-slate-300">Kelola semua vault dan posisi investasi kamu</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Balance</p>
                  <p className="text-heading text-white">Rp {(totalBalance / 1000000).toFixed(1)}jt</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Earned</p>
                  <p className="text-heading text-white">Rp {(totalEarned / 1000000).toFixed(1)}jt</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active Vaults</p>
                  <p className="text-heading text-white">{activeVaults}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Avg APY</p>
                  <p className="text-heading text-white">{avgAPY.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  filterStatus === 'all' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                }`}
              >
                Semua ({vaults.length})
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  filterStatus === 'active' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                }`}
              >
                Active ({vaults.filter(v => v.status === 'Active').length})
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  filterStatus === 'inactive' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                }`}
              >
                Inactive ({vaults.filter(v => v.status === 'Inactive').length})
              </button>
            </div>
          </div>

          {/* Vault List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVaults.map((vault) => (
              <div
                key={vault.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {vault.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-subheading text-white">{vault.name}</h3>
                      <p className="text-sm text-slate-400">{vault.strategy}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    vault.status === 'Active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-slate-500/20 text-slate-400'
                  }`}>
                    {vault.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Balance</span>
                    <span className="text-white font-semibold">Rp {(vault.balance / 1000000).toFixed(1)}jt</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">APY</span>
                    <span className="text-green-400 font-semibold">{vault.apy}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Daily Yield</span>
                    <span className="text-blue-400 font-semibold">Rp {(vault.dailyYield / 1000).toFixed(1)}rb</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Total Earned</span>
                    <span className="text-purple-400 font-semibold">Rp {(vault.totalEarned / 1000000).toFixed(1)}jt</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Since {vault.startDate}</span>
                  <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors group-hover:gap-3">
                    View Details
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ChatBot />
    </>
  );
}
