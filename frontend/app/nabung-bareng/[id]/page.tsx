'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { Users, TrendingUp, Clock, DollarSign, Calendar, Award, ArrowLeft, Share2, Settings, MessageCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function GroupDetail({ params }: { params: { id: string } }) {
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Dummy data - nanti fetch based on params.id
  const group = {
    id: params.id,
    name: 'Tim Startup Gaji Pas',
    members: 5,
    maxMembers: 10,
    targetAmount: 50000000,
    currentAmount: 25000000,
    strategy: 'Cash-Secured Put',
    apy: 8.5,
    status: 'Active',
    role: 'Creator',
    nextContribution: '3 hari lagi',
    createdDate: '15 Jan 2026',
    contributionSchedule: 'Mingguan',
  };

  const members = [
    { id: 1, name: 'Andi Wijaya (Kamu)', avatar: 'AW', role: 'Creator', contribution: 7500000, status: 'Aktif' },
    { id: 2, name: 'Budi Santoso', avatar: 'BS', role: 'Member', contribution: 6000000, status: 'Aktif' },
    { id: 3, name: 'Citra Dewi', avatar: 'CD', role: 'Member', contribution: 5500000, status: 'Aktif' },
    { id: 4, name: 'Dedi Kurniawan', avatar: 'DK', role: 'Member', contribution: 4000000, status: 'Aktif' },
    { id: 5, name: 'Eka Putri', avatar: 'EP', role: 'Member', contribution: 2000000, status: 'Pending' },
  ];

  const activities = [
    { id: 1, type: 'contribution', member: 'Andi Wijaya', amount: 1000000, date: '2 jam lalu' },
    { id: 2, type: 'join', member: 'Eka Putri', date: '1 hari lalu' },
    { id: 3, type: 'contribution', member: 'Budi Santoso', amount: 1000000, date: '2 hari lalu' },
    { id: 4, type: 'contribution', member: 'Citra Dewi', amount: 1000000, date: '3 hari lagi' },
  ];

  const progress = (group.currentAmount / group.targetAmount) * 100;

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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 bg-slate-800/30 rounded-xl p-4">
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs text-slate-400">Members</p>
                  <p className="text-white font-semibold">{group.members}/{group.maxMembers}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/30 rounded-xl p-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs text-slate-400">APY</p>
                  <p className="text-white font-semibold">{group.apy}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/30 rounded-xl p-4">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Jadwal</p>
                  <p className="text-white font-semibold">{group.contributionSchedule}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/30 rounded-xl p-4">
                <Clock className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-xs text-slate-400">Kontribusi</p>
                  <p className="text-white font-semibold">{group.nextContribution}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all text-white font-semibold">
              <DollarSign className="w-5 h-5" />
              Kontribusi Sekarang
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center justify-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-all text-white font-semibold"
            >
              <Share2 className="w-5 h-5" />
              Ajak Teman Baru
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Members List */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-heading text-white mb-6">Anggota Grup</h2>
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
                      </p>
                    </div>
                    <div>
                      {member.status === 'Aktif' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                  </div>
                ))}
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

          {/* Strategy Info */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-heading text-white mb-4">Strategi Investasi</h2>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-subheading text-white mb-2">{group.strategy}</h3>
                <p className="text-body text-slate-400 mb-3">
                  Strategi ini memungkinkan grup untuk mendapatkan premium dengan menjual opsi put. 
                  Cocok untuk membeli aset di harga lebih murah dengan risiko yang terukur.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    APY {group.apy}%
                  </span>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                    Medium Risk
                  </span>
                </div>
              </div>
            </div>
          </div>
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
