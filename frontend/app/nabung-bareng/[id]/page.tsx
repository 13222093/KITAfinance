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
    { id: 1, type: 'join', member: 'Eka Putri', date: '1 jam lalu' , amount: 0},
    { id: 2, type: 'join', member: 'Dedi Kurniawan', date: '2 jam lalu', amount: 0},
    { id: 3, type: 'join', member: 'Citra Dewi', date: '3 jam lalu', amount: 0},
    { id: 4, type: 'join', member: 'Budi Santoso', date: '5 jam lalu', amount: 0},
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 px-4 pb-24">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/nabung-bareng"
              className="w-10 h-10 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div className="flex-1">
              <h1 className="text-ultra-heading text-white">{group.name}</h1>
              <p className="text-sm text-slate-400">Dibuat pada {group.createdDate}</p>
            </div>
            {group.role === 'Creator' && (
              <button className="w-10 h-10 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-center transition-colors">
                <Settings className="w-5 h-5 text-slate-300" />
              </button>
            )}
          </div>

          {/* Main Stats Card */}
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Terkumpul</p>
                <p className="text-heading text-white">Rp {(group.currentAmount / 1000000).toFixed(1)}jt</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Target Dana</p>
                <p className="text-heading text-white">Rp {(group.targetAmount / 1000000).toFixed(1)}jt</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Progress</p>
                <p className="text-heading text-white">{Math.round(progress)}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-slate-800/30 rounded-xl p-4">
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs text-slate-400">Members</p>
                  <p className="text-white font-semibold">{group.members}/{group.maxMembers}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/30 rounded-xl p-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Phase</p>
                  <p className="text-white font-semibold capitalize">{group.phase.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/30 rounded-xl p-4">
                <Calendar className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-slate-400">Created</p>
                  <p className="text-white font-semibold">{group.createdDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Based on Phase */}
          {group.phase === 'formation' && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all text-white font-semibold"
            >
              <Share2 className="w-5 h-5" />
              Ajak Teman Bergabung
            </button>
          )}

          {group.phase === 'contributing' && (
            <button 
              disabled={hasUserContributed}
              className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl transition-all text-white font-semibold ${
                hasUserContributed 
                  ? 'bg-slate-700/50 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              {hasUserContributed ? 'Sudah Berkontribusi' : 'Kontribusi Sekarang'}
            </button>
          )}

          {/* Strategy Voting - Phase 1 */}
          {group.phase === 'strategy_voting' && allMembersJoined && (
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-heading text-white">Pilih Strategi Investasi 🎯</h2>
                  <p className="text-sm text-slate-400">Semua member sudah bergabung. Voting strategi yang akan digunakan!</p>
                </div>
              </div>

              <div className="space-y-3">
                {strategyOptions.map((strategy) => {
                  const isSelected = userSelectedStrategy === strategy.id;
                  const isDisabled = userSelectedStrategy !== null && !isSelected;
                  
                  return (
                    <button
                      key={strategy.id}
                      onClick={() => !isDisabled && handleStrategyVote(strategy.id)}
                      disabled={isDisabled}
                      className={`w-full text-left p-5 rounded-xl transition-all ${
                        isSelected 
                          ? 'bg-purple-500/30 border-2 border-purple-500' 
                          : isDisabled
                          ? 'bg-slate-800/30 border border-slate-700/30 opacity-50 cursor-not-allowed'
                          : 'bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{strategy.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-subheading text-white mb-1">{strategy.name}</h3>
                          <p className="text-sm text-slate-400 mb-3">{strategy.description}</p>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">APY {strategy.apy}</span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              strategy.risk === 'Low' ? 'bg-blue-500/20 text-blue-400' :
                              strategy.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>{strategy.risk} Risk</span>
                          </div>
                        </div>
                        {isSelected ? (
                          <CheckCircle className="w-6 h-6 text-purple-400" />
                        ) : (
                          <ThumbsUp className={`w-5 h-5 ${isDisabled ? 'text-slate-600' : 'text-slate-500'}`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {userSelectedStrategy && (
                <button
                  onClick={handleCancelStrategyVote}
                  className="w-full mt-4 py-3 border-2 border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700/30 hover:border-slate-500 transition-all font-semibold"
                >
                  Batalkan Pilihan
                </button>
              )}

              <p className="text-xs text-slate-400 mt-4 text-center">
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
            {/* Members List */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-heading text-white">Anggota Grup</h2>
                <span className="text-sm text-slate-400">
                  {group.members}/{group.maxMembers} members
                </span>
              </div>
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-semibold">{member.name}</p>
                        {member.role === 'Creator' && (
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded">
                            Creator
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">
                        Kontribusi: Rp {(member.contribution / 1000000).toFixed(1)}jt
                        <span className="text-xs ml-2">
                          ({((member.contribution / group.targetAmount) * 100).toFixed(0)}%)
                        </span>
                      </p>
                    </div>
                    <div>
                      {group.phase === 'formation' && (
                        member.hasJoined ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        )
                      )}
                      {(group.phase === 'contributing' || group.phase === 'invested' || group.phase === 'completed_voting') && (
                        member.hasContributed ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Info pembagian sama rata */}
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-300">
                  💡 Kontribusi per orang: <span className="font-bold">Rp {(contributionPerMember / 1000000).toFixed(1)}jt</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Pembagian sama rata untuk {group.members} anggota
                </p>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-heading text-white mb-6">Aktivitas Terbaru</h2>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'contribution' ? 'bg-green-500/20' : 'bg-blue-500/20'
                    }`}>
                      {activity.type === 'contribution' ? (
                        <DollarSign className="w-5 h-5 text-green-400" />
                      ) : (
                        <Users className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        {activity.type === 'contribution' ? (
                          <>
                            <span className="font-semibold">{activity.member}</span> berkontribusi{' '}
                            <span className="font-semibold text-green-400">
                              Rp {(activity.amount! / 1000000).toFixed(1)}jt
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold">{activity.member}</span> bergabung ke grup
                          </>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{activity.date}</p>
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
