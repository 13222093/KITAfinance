'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { Users, TrendingUp, Clock, DollarSign, Calendar, Award, ArrowLeft, Share2, Settings, MessageCircle, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function GroupDetail({ params }: { params: { id: string } }) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [selectedVote, setSelectedVote] = useState<'accept' | 'reject' | null>(null);
  const [userSelectedStrategy, setUserSelectedStrategy] = useState<string | null>(null);

  // Dummy data
  const group = {
    id: params.id,
    name: 'Tim Startup Gaji Pas',
    members: 5,
    maxMembers: 5,
    targetAmount: 50000000,
    currentAmount: 0,
    selectedStrategy: null,
    role: 'Creator',
    createdDate: '15 Jan 2026',
    phase: 'strategy_voting',
  };

  // Current user ID untuk tracking kontribusi
  const currentUserId = 1;

  const members = [
    { id: 1, name: 'Andi Wijaya (Kamu)', avatar: 'AW', role: 'Creator', hasJoined: true, contribution: 0, hasContributed: false },
    { id: 2, name: 'Budi Santoso', avatar: 'BS', role: 'Member', hasJoined: true, contribution: 0, hasContributed: false },
    { id: 3, name: 'Citra Dewi', avatar: 'CD', role: 'Member', hasJoined: true, contribution: 0, hasContributed: false },
    { id: 4, name: 'Dedi Kurniawan', avatar: 'DK', role: 'Member', hasJoined: true, contribution: 0, hasContributed: false },
    { id: 5, name: 'Eka Putri', avatar: 'EP', role: 'Member', hasJoined: true, contribution: 0, hasContributed: false },
  ];

  const activities = [
    { id: 1, type: 'join', member: 'Eka Putri', date: '1 jam lalu', amount: 0 },
    { id: 2, type: 'join', member: 'Dedi Kurniawan', date: '2 jam lalu', amount: 0 },
    { id: 3, type: 'join', member: 'Citra Dewi', date: '3 jam lalu', amount: 0 },
    { id: 4, type: 'join', member: 'Budi Santoso', date: '5 jam lalu', amount: 0 },
  ];

  // Strategi yang tersedia untuk voting
  const strategyOptions = [
    {
      id: 'cash-secured-put',
      name: 'Cash-Secured Put',
      description: 'Beli murah dapat cashback - Cocok untuk membeli aset di harga lebih murah',
      apy: '8-12%',
      risk: 'Medium',
      icon: '💰',
    },
    {
      id: 'covered-call',
      name: 'Covered Call',
      description: 'Nabung aset dapat bunga - Hasilkan income dari aset yang dimiliki',
      apy: '6-10%',
      risk: 'Low',
      icon: '🏦',
    },
    {
      id: 'buy-call',
      name: 'Buy Call (Tebak Naik)',
      description: 'Modal receh potensi jackpot - Spekulasi kenaikan harga dengan modal terbatas',
      apy: '50-200%',
      risk: 'High',
      icon: '🚀',
    },
    {
      id: 'buy-put',
      name: 'Buy Put (Tebak Turun)',
      description: 'Tiket cuan pas turun - Profit dari penurunan harga dengan risiko terbatas',
      apy: '40-180%',
      risk: 'High',
      icon: '📉',
    },
  ];

  // RFQ proposal untuk voting (setelah contributing selesai)
  const repeatVotingOptions = {
    currentProfit: 2500000, // Total profit yang didapat
    profitPerMember: 500000, // Profit per orang
  };

  const progress = (group.currentAmount / group.targetAmount) * 100;
  const contributionPerMember = group.targetAmount / group.members; // Pembagian sama rata

  // Check apakah user sudah kontribusi
  const currentUser = members.find(m => m.id === currentUserId);
  const hasUserContributed = currentUser?.hasContributed || false;

  // Check apakah semua member sudah join
  const allMembersJoined = members.every(m => m.hasJoined);

  // Check apakah semua member sudah contribute
  const allMembersContributed = members.every(m => m.hasContributed);

  const handleStrategyVote = (strategyId: string) => {
    // Set user's selected strategy (freeze other buttons)
    setUserSelectedStrategy(strategyId);
    // TODO: Submit strategy vote to backend
    console.log('Strategy voted:', strategyId);
  };

  const handleCancelStrategyVote = () => {
    // Reset user's selection
    setUserSelectedStrategy(null);
    // TODO: Cancel vote in backend
    console.log('Strategy vote cancelled');
  };

  const handleRepeatVote = (decision: 'repeat' | 'withdraw') => {
    setSelectedVote(decision as any);
    // TODO: Submit repeat/withdraw vote to backend
    console.log('Repeat vote submitted:', decision);
    setTimeout(() => {
      setShowVotingModal(false);
    }, 1000);
  };

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
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/nabung-bareng"
              className="group w-12 h-12 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6 text-[#0A4A7C] group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex-1">
              <div className="inline-block bg-gradient-to-r from-[#C15BFF] to-[#0A98FF] text-white px-3 py-1 rounded-full text-xs font-bold mb-1 shadow-md">
                GROUP
              </div>
              <h1 className="text-4xl font-black text-white drop-shadow-lg">{group.name}</h1>
              <p className="text-white/90 font-medium">Dibuat pada {group.createdDate}</p>
            </div>
            {group.role === 'Creator' && (
              <button className="group w-12 h-12 bg-white/95 backdrop-blur-sm border-2 border-white/50 rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300">
                <Settings className="w-6 h-6 text-[#0A4A7C] group-hover:rotate-90 transition-transform duration-500" />
              </button>
            )}
          </div>

          {/* Main Stats Card - Enhanced */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white/50">
            {/* Primary Stats - Large Display */}
            <div className="mb-6">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">Total Terkumpul</p>
                  <p className="text-4xl md:text-5xl font-black text-[#0A4A7C]">Rp {(group.currentAmount / 1000000).toFixed(1)}jt</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-500 mb-1">Target</p>
                  <p className="text-2xl md:text-3xl font-black text-gray-400">Rp {(group.targetAmount / 1000000).toFixed(1)}jt</p>
                </div>
              </div>

              {/* Progress Bar - Enhanced with Glow */}
              <div className="relative mt-4">
                <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#C15BFF] via-[#0A98FF] to-[#00FFF0] rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="absolute -top-1 left-0 right-0 flex items-center justify-center">
                  <span className="text-xs font-black text-white drop-shadow-lg px-3 py-1 bg-gradient-to-r from-[#C15BFF] to-[#0A98FF] rounded-full">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid - Enhanced */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border-2 border-purple-200 hover:scale-105 transition-transform">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-purple-500 rounded-xl shadow-lg">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-bold text-purple-600 mb-1">Members</p>
                <p className="text-xl md:text-2xl font-black text-purple-900">{group.members}/{group.maxMembers}</p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-4 border-2 border-cyan-200 hover:scale-105 transition-transform">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-cyan-500 rounded-xl shadow-lg">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-bold text-cyan-600 mb-1">Phase</p>
                <p className="text-sm md:text-base font-black text-cyan-900 capitalize">{group.phase.replace('_', ' ')}</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4 border-2 border-amber-200 hover:scale-105 transition-transform">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-amber-500 rounded-xl shadow-lg">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-bold text-amber-600 mb-1">Created</p>
                <p className="text-sm md:text-base font-black text-amber-900">{group.createdDate}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Based on Phase */}
          {/* Action Buttons - Based on Phase */}
          {group.phase === 'formation' && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="w-full group flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-[#C15BFF] to-[#0A98FF] hover:from-[#d07eff] hover:to-[#2aaeff] rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-white font-bold text-lg border-b-4 border-black/20 active:border-b-0 active:translate-y-1"
            >
              <Share2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Ajak Teman Bergabung
            </button>
          )}

          {group.phase === 'contributing' && (
            <button
              disabled={hasUserContributed}
              className={`w-full group flex items-center justify-center gap-3 p-5 rounded-2xl shadow-xl transition-all duration-300 text-white font-bold text-lg ${hasUserContributed
                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                : 'bg-gradient-to-r from-[#FFBC57] to-[#FF9500] hover:scale-[1.02] hover:shadow-2xl border-b-4 border-black/20 active:border-b-0 active:translate-y-1'
                }`}
            >
              <DollarSign className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {hasUserContributed ? 'Sudah Berkontribusi' : 'Kontribusi Sekarang'}
            </button>
          )}

          {/* Strategy Voting - Phase 1 */}
          {group.phase === 'strategy_voting' && allMembersJoined && (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#C15BFF] to-[#0A98FF] rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#0A4A7C] mb-1">Pilih Strategi Investasi 🎯</h2>
                  <p className="text-gray-600">Semua member sudah bergabung. Voting strategi yang akan digunakan!</p>
                </div>
              </div>

              <div className="space-y-4">
                {strategyOptions.map((strategy) => {
                  const isSelected = userSelectedStrategy === strategy.id;
                  const isDisabled = userSelectedStrategy !== null && !isSelected;

                  return (
                    <button
                      key={strategy.id}
                      onClick={() => !isDisabled && handleStrategyVote(strategy.id)}
                      disabled={isDisabled}
                      className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border-2 ${isSelected
                        ? 'bg-purple-50 border-[#C15BFF] shadow-lg scale-[1.02]'
                        : isDisabled
                          ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed grayscale'
                          : 'bg-white hover:bg-gray-50 border-gray-100 hover:border-[#C15BFF] hover:shadow-md'
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl filter drop-shadow-md">{strategy.icon}</div>
                        <div className="flex-1">
                          <h3 className={`text-xl font-bold mb-1 ${isSelected ? 'text-[#C15BFF]' : 'text-[#0A4A7C]'}`}>{strategy.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg border border-green-200">APY {strategy.apy}</span>
                            <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${strategy.risk === 'Low' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              strategy.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                'bg-red-100 text-red-700 border-red-200'
                              }`}>{strategy.risk} Risk</span>
                          </div>
                        </div>
                        {isSelected ? (
                          <div className="w-8 h-8 bg-[#C15BFF] rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <ThumbsUp className={`w-4 h-4 ${isDisabled ? 'text-gray-300' : 'text-gray-400'}`} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {userSelectedStrategy && (
                <button
                  onClick={handleCancelStrategyVote}
                  className="w-full mt-6 py-4 border-2 border-gray-300 text-gray-500 rounded-xl hover:bg-gray-50 hover:border-red-400 hover:text-red-500 transition-all font-bold"
                >
                  Batalkan Pilihan
                </button>
              )}

              <p className="text-xs text-gray-400 mt-6 text-center font-bold bg-gray-50 py-2 rounded-lg">
                💡 Voting ditutup otomatis setelah 50%+1 member setuju pada satu strategi
              </p>
            </div>
          )}

          {/* Repeat/Withdraw Voting - Phase 5 */}
          {group.phase === 'completed_voting' && (
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-heading text-white">Investasi Berhasil! 🎉</h2>
                  <p className="text-sm text-slate-400">Profit sudah didapat. Pilih tindakan selanjutnya.</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-5 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Total Profit Grup</p>
                    <p className="text-green-400 font-bold text-xl">Rp {(repeatVotingOptions.currentProfit / 1000000).toFixed(1)}jt</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Profit per Orang</p>
                    <p className="text-green-400 font-bold text-xl">Rp {(repeatVotingOptions.profitPerMember / 1000000).toFixed(1)}jt</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => handleRepeatVote('repeat')}
                  className="flex flex-col items-center justify-center gap-2 p-6 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 rounded-xl transition-all"
                >
                  <div className="text-2xl">🔄</div>
                  <span className="font-semibold">Repeat Invest</span>
                  <span className="text-xs text-slate-400 text-center">Lanjut dengan strategi & target yang sama</span>
                </button>
                <button
                  onClick={() => handleRepeatVote('withdraw')}
                  className="flex flex-col items-center justify-center gap-2 p-6 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-300 rounded-xl transition-all"
                >
                  <div className="text-2xl">💰</div>
                  <span className="font-semibold">Tarik Profit</span>
                  <span className="text-xs text-slate-400 text-center">Ambil profit dan bubarkan grup</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-3 text-center">
                Voting akan ditutup dalam 48 jam
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Members List - Enhanced Grid */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-[#0A4A7C]">Anggota Grup</h2>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-xs font-black rounded-full border-2 border-purple-300">
                  {group.members}/{group.maxMembers} members
                </span>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {members.map((member) => {
                  const memberProgress = member.contribution > 0 ? (member.contribution / contributionPerMember) * 100 : 0;

                  return (
                    <div
                      key={member.id}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group"
                    >
                      {/* Member Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#C15BFF] to-[#0A98FF] rounded-xl flex items-center justify-center text-white font-black shadow-lg group-hover:scale-110 transition-transform">
                          {member.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[#0A4A7C] font-bold truncate">{member.name}</p>
                            {member.role === 'Creator' && (
                              <span className="px-2 py-0.5 bg-gradient-to-r from-[#C15BFF] to-[#0A98FF] text-white text-xs font-bold rounded-full shadow-sm flex-shrink-0">
                                👑
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 font-medium">
                            Rp {(member.contribution / 1000000).toFixed(1)}jt
                          </p>
                        </div>
                        {/* Status Icon */}
                        <div>
                          {group.phase === 'formation' && (
                            member.hasJoined ? (
                              <div className="bg-green-100 p-1.5 rounded-full">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </div>
                            ) : (
                              <div className="bg-yellow-100 p-1.5 rounded-full">
                                <Clock className="w-4 h-4 text-yellow-600" />
                              </div>
                            )
                          )}
                          {(group.phase === 'contributing' || group.phase === 'invested' || group.phase === 'completed_voting') && (
                            member.hasContributed ? (
                              <div className="bg-green-100 p-1.5 rounded-full">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </div>
                            ) : (
                              <div className="bg-yellow-100 p-1.5 rounded-full">
                                <Clock className="w-4 h-4 text-yellow-600" />
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Contribution Progress Bar */}
                      {contributionPerMember > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-gray-500">Kontribusi</span>
                            <span className="text-xs font-black text-purple-600">{Math.round(memberProgress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#C15BFF] to-[#0A98FF] rounded-full transition-all duration-500"
                              style={{ width: `${memberProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Info pembagian sama rata */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl">
                <p className="text-sm text-blue-800 font-bold">
                  💡 Kontribusi per orang: <span className="text-blue-900">Rp {(contributionPerMember / 1000000).toFixed(1)}jt</span>
                </p>
                <p className="text-xs text-blue-600 mt-1 font-semibold">
                  Pembagian sama rata untuk {group.members} anggota
                </p>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white/50 h-fit">
              <h2 className="text-2xl font-black text-[#0A4A7C] mb-8">Aktivitas Terbaru</h2>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${activity.type === 'contribution' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                      {activity.type === 'contribution' ? (
                        <DollarSign className="w-5 h-5 text-green-600" />
                      ) : (
                        <Users className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed text-left">
                        {activity.type === 'contribution' ? (
                          <>
                            <span className="font-bold text-[#0A4A7C]">{activity.member}</span> berkontribusi{' '}
                            <span className="font-bold text-green-600">
                              Rp {(activity.amount! / 1000000).toFixed(1)}jt
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-bold text-[#0A4A7C]">{activity.member}</span> bergabung ke grup
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 font-medium">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategy Info - Hanya tampil setelah strategi dipilih */}
          {group.selectedStrategy && (group.phase === 'contributing' || group.phase === 'invested' || group.phase === 'completed_voting') && (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-heading text-white mb-4">Strategi Terpilih</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-subheading text-white mb-2">{group.selectedStrategy}</h3>
                  <p className="text-body text-slate-400 mb-3">
                    Strategi ini memungkinkan grup untuk mendapatkan premium dengan menjual opsi put.
                    Cocok untuk membeli aset di harga lebih murah dengan risiko yang terukur.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                      ✅ Dipilih oleh mayoritas member
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal (reuse from main page) */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 rounded-3xl max-w-md w-full border border-slate-700/50">
            <div className="border-b border-slate-700/50 p-6 flex items-center justify-between">
              <h2 className="text-heading text-white">Ajak Teman</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <Share2 className="w-5 h-5 text-slate-300" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-slate-400">Bagikan link ini ke teman untuk join grup</p>
              <div className="flex items-center gap-2 p-4 bg-slate-700/50 rounded-xl">
                <input
                  type="text"
                  value={`https://nunggu.app/join/${group.id}`}
                  readOnly
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                />
              </div>
              <button className="w-full flex items-center justify-center gap-3 p-4 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">Share via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatBot />
    </>
  );
}
