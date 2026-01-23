'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Users, Calendar, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function History() {
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdraw' | 'yield'>('all');

  // Dummy data untuk history
  const activities = [
    { id: 1, type: 'deposit', action: 'Deposit', amount: 5000000, date: '21 Jan 2026', time: '14:30', description: 'Deposit ke USDC Vault' },
    { id: 2, type: 'yield', action: 'Yield Earned', amount: 150000, date: '20 Jan 2026', time: '00:00', description: 'Daily yield dari USDC Vault' },
    { id: 3, type: 'deposit', action: 'Deposit', amount: 3000000, date: '19 Jan 2026', time: '10:15', description: 'Deposit ke USDT Vault' },
    { id: 4, type: 'withdraw', action: 'Withdraw', amount: 2000000, date: '18 Jan 2026', time: '16:45', description: 'Withdraw dari DAI Vault' },
    { id: 5, type: 'yield', action: 'Yield Earned', amount: 125000, date: '17 Jan 2026', time: '00:00', description: 'Daily yield dari USDT Vault' },
    { id: 6, type: 'deposit', action: 'Group Contribution', amount: 10000000, date: '16 Jan 2026', time: '09:20', description: 'Kontribusi ke Tim Startup Gaji Pas' },
    { id: 7, type: 'yield', action: 'Yield Earned', amount: 180000, date: '15 Jan 2026', time: '00:00', description: 'Daily yield dari USDC Vault' },
    { id: 8, type: 'withdraw', action: 'Withdraw', amount: 1500000, date: '14 Jan 2026', time: '11:30', description: 'Withdraw dari USDC Vault' },
    { id: 9, type: 'deposit', action: 'Deposit', amount: 8000000, date: '13 Jan 2026', time: '15:00', description: 'Deposit ke DAI Vault' },
    { id: 10, type: 'yield', action: 'Yield Earned', amount: 95000, date: '12 Jan 2026', time: '00:00', description: 'Daily yield dari DAI Vault' },
  ];

  const filteredActivities = filterType === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filterType);

  const totalDeposits = activities.filter(a => a.type === 'deposit').reduce((sum, a) => sum + a.amount, 0);
  const totalWithdraws = activities.filter(a => a.type === 'withdraw').reduce((sum, a) => sum + a.amount, 0);
  const totalYield = activities.filter(a => a.type === 'yield').reduce((sum, a) => sum + a.amount, 0);

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
            <div>
              <h1 className="text-ultra-heading text-white">Riwayat Transaksi</h1>
              <p className="text-body text-slate-300">Semua aktivitas deposit, withdraw, dan yield</p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <ArrowDownRight className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Deposits</p>
                  <p className="text-heading text-white">Rp {(totalDeposits / 1000000).toFixed(1)}jt</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <ArrowUpRight className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Withdraws</p>
                  <p className="text-heading text-white">Rp {(totalWithdraws / 1000000).toFixed(1)}jt</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Yield</p>
                  <p className="text-heading text-white">Rp {(totalYield / 1000000).toFixed(1)}jt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400 ml-2" />
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  filterType === 'all' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('deposit')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  filterType === 'deposit' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setFilterType('withdraw')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  filterType === 'withdraw' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                }`}
              >
                Withdraw
              </button>
              <button
                onClick={() => setFilterType('yield')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  filterType === 'yield' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                }`}
              >
                Yield
              </button>
            </div>
          </div>

          {/* Activity List */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-heading text-white mb-6">
              {filterType === 'all' ? 'Semua Aktivitas' : `Aktivitas ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
            </h2>
            <div className="space-y-3">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors border border-slate-600/30"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    activity.type === 'deposit' 
                      ? 'bg-green-500/20' 
                      : activity.type === 'yield' 
                      ? 'bg-blue-500/20' 
                      : 'bg-red-500/20'
                  }`}>
                    {activity.type === 'deposit' ? (
                      <ArrowDownRight className="w-6 h-6 text-green-400" />
                    ) : activity.type === 'yield' ? (
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold">{activity.action}</p>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        activity.type === 'deposit' 
                          ? 'bg-green-500/20 text-green-400' 
                          : activity.type === 'yield' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {activity.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{activity.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {activity.date}
                      </span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      activity.type === 'withdraw' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {activity.type === 'withdraw' ? '-' : '+'}Rp {(activity.amount / 1000000).toFixed(1)}jt
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </>
  );
}
