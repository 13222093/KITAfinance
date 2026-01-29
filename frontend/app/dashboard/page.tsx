'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { TrendingUp, Wallet, Target, Award, ArrowUpRight, ArrowDownRight, Plus, Users, X, TrendingDown, DollarSign, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Position {
  id: number;
  name: string;
  apy: number;
  balance: number;
  status: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [showSoloModal, setShowSoloModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  // Data dummy (fallback)
  const defaultStats = {
    totalBalance: 0,
    totalYield: 0,
    activePositions: 0,
    monthlyReturn: 0,
  };

  useEffect(() => {
    const fetchProfile = async () => {
      // Get session
      const sessionStr = localStorage.getItem('userSession');
      if (!sessionStr) {
        router.push('/login');
        return;
      }
      
      const session = JSON.parse(sessionStr);
      // Determine identity (wallet or phone)
      // The API accepts either, but let's use what we have. 
      // Auth router returns id, phoneNumber, walletAddress.
      const identifier = session.walletAddress || session.phoneNumber;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/profile/${identifier}`);
        const data = await res.json();
        
        if (data.success) {
          setUserData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const stats = userData?.stats || defaultStats;
  const positions = userData?.positions || [];
  // const recentActivities = userData?.history || []; // Backend not sending history yet, keep dummy or empty
  
  const soloStrategies = [
    {
      id: 1,
      title: 'Beli Murah Dapat Cashback',
      subtitle: 'Cash-Secured Put',
      description: 'Dapat premium dengan menjual opsi put. Cocok untuk beli aset di harga lebih murah.',
      icon: DollarSign,
      color: 'blue',
      risk: 'Medium',
    },
    {
      id: 2,
      title: 'Nabung Aset Dapat Bunga',
      subtitle: 'Covered Call Vault',
      description: 'Hasilkan yield dari aset yang kamu punya dengan strategi covered call.',
      icon: Wallet,
      color: 'green',
      risk: 'Low',
    },
    {
      id: 3,
      title: 'Modal Receh, Potensi Jackpot',
      subtitle: 'Buy Call',
      description: 'Beli opsi call untuk profit dari kenaikan harga dengan risiko terbatas.',
      icon: Zap,
      color: 'purple',
      risk: 'High',
    },
    {
      id: 4,
      title: 'Tiket Cuan Pas Turun',
      subtitle: 'Buy Put',
      description: 'Beli opsi put untuk profit dari penurunan harga dengan risiko terbatas.',
      icon: TrendingDown,
      color: 'red',
      risk: 'High',
    },
  ];

  const recentActivities = [
    { id: 1, action: 'Deposit', amount: 5000000, date: '2 jam lalu', type: 'deposit' },
    { id: 2, action: 'Yield Earned', amount: 150000, date: '1 hari lalu', type: 'yield' },
    { id: 3, action: 'Withdraw', amount: 2000000, date: '3 hari lalu', type: 'withdraw' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Memuat Data Portfolio...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 px-4 pb-24">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="mb-8 mt-8">
            <h1 className="text-ultra-heading text-white mb-1">
              Hi, {userData?.user?.name || 'Investor'}! 👋
            </h1>
            <p className="text-body text-slate-300">Lihat portfolio dan semua yield kamu di sini.</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => setShowSoloModal(true)}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Plus className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-subheading text-white mb-1">Nabung Solo</h3>
                  <p className="text-body text-slate-400">Mulai investasi sendiri dengan APY hingga 9%</p>
                </div>
              </div>
            </button>

            <Link href="/nabung-bareng" className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all text-left group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-subheading text-white mb-1">Nabung Bareng</h3>
                  <p className="text-body text-slate-400">Investasi bersama teman dan keluarga</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Balance */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  +12.5%
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-1">Total Balance</p>
              <h3 className="text-heading text-white">
                Rp {(stats.totalBalance / 1000000).toFixed(1)}jt
              </h3>
            </div>

            {/* Total Yield */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  +8.2%
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-1">Total Yield</p>
              <h3 className="text-heading text-white">
                Rp {(stats.totalYield / 1000).toFixed(0)}rb
              </h3>
            </div>

            {/* Active Positions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-1">Active Positions</p>
              <h3 className="text-heading text-white">{stats.activePositions}</h3>
            </div>

            {/* Monthly Return */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-1">Monthly Return</p>
              <h3 className="text-heading text-white">{stats.monthlyReturn}%</h3>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Positions */}
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-subheading text-white mb-6">Active Positions</h2>
              <div className="space-y-4">
                {positions.map((position: Position) => (
                  <div
                    key={position.id}
                    className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors border border-slate-600/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                        {position.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{position.name}</h4>
                        <p className="text-sm text-slate-400">
                          APY: <span className="text-green-400 font-semibold">{position.apy}%</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
                        Rp {(position.balance / 1000000).toFixed(1)}jt
                      </p>
                      <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                        {position.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/vaults" className="block text-button w-full mt-6 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all text-center">
                View All Positions
              </Link>
            </div>

            {/* Recent Activities */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-subheading text-white mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'deposit'
                          ? 'bg-green-500/20'
                          : activity.type === 'yield'
                          ? 'bg-blue-500/20'
                          : 'bg-red-500/20'
                      }`}
                    >
                      {activity.type === 'deposit' ? (
                        <ArrowDownRight className="w-5 h-5 text-green-400" />
                      ) : activity.type === 'yield' ? (
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{activity.action}</p>
                      <p className="text-sm text-slate-400">{activity.date}</p>
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        activity.type === 'withdraw' ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {activity.type === 'withdraw' ? '-' : '+'}
                      Rp {(activity.amount / 1000).toFixed(0)}rb
                    </p>
                  </div>
                ))}
              </div>
              <Link href="/history" className="block text-button w-full mt-6 py-3 border-2 border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700/30 transition-all text-center">
                View History
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Solo Strategy Modal */}
      {showSoloModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8">
          <div className="bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-heading text-white mb-1">Pilih Strategi Nabung Solo</h2>
                <p className="text-body text-slate-400">Pilih strategi yang sesuai dengan tujuan investasimu</p>
              </div>
              <button
                onClick={() => setShowSoloModal(false)}
                className="w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {soloStrategies.map((strategy) => {
                  const Icon = strategy.icon;
                  const colorClasses = {
                    blue: 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30',
                    green: 'bg-green-500/20 text-green-400 group-hover:bg-green-500/30',
                    purple: 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30',
                    red: 'bg-red-500/20 text-red-400 group-hover:bg-red-500/30',
                  };
                  const riskColors = {
                    Low: 'bg-green-500/20 text-green-400',
                    Medium: 'bg-yellow-500/20 text-yellow-400',
                    High: 'bg-red-500/20 text-red-400',
                  };

                  const strategyLinks: { [key: number]: string } = {
                    1: '/solo/cash-secured-put',
                    2: '/solo/covered-call',
                    3: '/solo/buy-call',
                    4: '/solo/buy-put',
                  };

                  return (
                    <Link
                      key={strategy.id}
                      href={strategyLinks[strategy.id]}
                      className="bg-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:bg-slate-700/50 transition-all text-left group block"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${colorClasses[strategy.color as keyof typeof colorClasses]}`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <h3 className="subheading text-white mb-1">{strategy.title}</h3>
                          <p className="text-sm text-slate-400 mb-2">{strategy.subtitle}</p>
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${riskColors[strategy.risk as keyof typeof riskColors]}`}>
                            Risk: {strategy.risk}
                          </span>
                        </div>
                      </div>
                      <p className="body-text text-slate-300">{strategy.description}</p>
                      <div className="mt-4 pt-4 border-t border-slate-600/30">
                        <span className="text-sm text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                          Pilih Strategi →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <ChatBot />
    </>
  );
}
