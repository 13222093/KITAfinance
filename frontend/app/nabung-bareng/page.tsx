'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { Users, Plus, TrendingUp, Calendar, Award, Target, Clock, DollarSign, CheckCircle, X, Share2, Copy, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function NabungBareng() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [createGroupStep, setCreateGroupStep] = useState(1); // 1 = form, 2 = invite members

  // Data dummy untuk groups
  const myGroups = [
    {
      id: 1,
      name: 'Tim Startup Gaji Pas',
      members: 5,
      targetAmount: 50000000,
      currentAmount: 25000000,
      strategy: 'Cash-Secured Put',
      apy: 8.5,
      status: 'Active',
      role: 'Creator',
      nextContribution: '3 hari lagi',
    },
    {
      id: 2,
      name: 'Keluarga Sukses',
      members: 8,
      targetAmount: 100000000,
      currentAmount: 45000000,
      strategy: 'Covered Call Vault',
      apy: 7.2,
      status: 'Active',
      role: 'Member',
      nextContribution: '5 hari lagi',
    },
  ];

  // Dummy data untuk suggested friends
  const suggestedFriends = [
    { id: 1, name: 'Budi Santoso', username: 'budisantoso', avatar: 'BS' },
    { id: 2, name: 'Siti Rahayu', username: 'sitirahayu', avatar: 'SR' },
    { id: 3, name: 'Ahmad Wijaya', username: 'ahmadwijaya', avatar: 'AW' },
    { id: 4, name: 'Dewi Lestari', username: 'dewilestari', avatar: 'DL' },
  ];

  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

  const toggleFriendSelection = (friendId: number) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const benefits = [
    {
      icon: Users,
      title: 'Investasi Bersama',
      description: 'Patungan dengan teman dan keluarga untuk modal lebih besar',
    },
    {
      icon: Target,
      title: 'Target Jelas',
      description: 'Tentukan target finansial bersama dan capai lebih cepat',
    },
    {
      icon: Award,
      title: 'Reward Kolektif',
      description: 'Dapatkan bonus dan achievement sebagai tim',
    },
    {
      icon: TrendingUp,
      title: 'Yield Lebih Tinggi',
      description: 'Modal besar = akses ke strategi dengan return lebih optimal',
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 px-4 pb-24">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="mb-8 mt-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-ultra-heading text-white mb-2">Nabung Bareng</h1>
              <p className="text-body text-slate-300">Investasi bersama teman dan keluarga, capai target lebih cepat</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all text-white font-semibold whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Buat Grup
            </button>
          </div>

          {/* Benefits Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-heading text-white mb-6">Emang harus Nabung Bareng?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-subheading text-white mb-2">{benefit.title}</h3>
                    <p className="text-body text-slate-400">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* My Groups Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading text-white">Grup Saya</h2>
              <span className="text-sm text-slate-400">{myGroups.length} Grup Aktif</span>
            </div>
            <div className="space-y-4">
              {myGroups.map((group) => {
                const progress = (group.currentAmount / group.targetAmount) * 100;
                return (
                  <Link
                    key={group.id}
                    href={`/nabung-bareng/${group.id}`}
                    className="block bg-slate-700/30 border border-slate-600/30 rounded-xl p-6 hover:bg-slate-700/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-subheading text-white">{group.name}</h3>
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full">
                            {group.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {group.members} Members
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            APY {group.apy}%
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {group.nextContribution}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">Progress</p>
                        <p className="text-heading text-white">{Math.round(progress)}%</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-slate-600/30 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-sm">
                        <span className="text-slate-400">
                          Rp {(group.currentAmount / 1000000).toFixed(1)}jt
                        </span>
                        <span className="text-white font-semibold">
                          Rp {(group.targetAmount / 1000000).toFixed(1)}jt
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-600/30">
                      <span className="text-sm text-slate-400">Strategi: {group.strategy}</span>
                      <button
                        onClick={() => setShowInviteModal(true)}
                        className="btn-text text-sm px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Ajak Teman
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700/50 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-heading text-white mb-1">
                  {createGroupStep === 1 ? 'Buat Grup Baru' : 'Ajak Teman'}
                </h2>
                <p className="text-body text-slate-400">
                  {createGroupStep === 1 
                    ? 'Isi detail grup nabung bareng kamu' 
                    : 'Pilih teman atau bagikan link untuk join grup'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateGroupStep(1);
                  setSelectedFriends([]);
                }}
                className="w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {createGroupStep === 1 ? (
                // Step 1: Form Buat Grup
                <>
              {/* Group Name */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Nama Grup</label>
                <input
                  type="text"
                  placeholder="Contoh: Tim Startup Gaji Pas"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Target Amount */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Target Dana</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">Rp</span>
                  <input
                    type="number"
                    placeholder="50.000.000"
                    className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Max Members */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Maksimal Anggota</label>
                <input
                  type="number"
                  placeholder="10"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Strategy Selection */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Pilih Strategi</label>
                <select className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Cash-Secured Put (APY 8.5%)</option>
                  <option>Covered Call Vault (APY 7.2%)</option>
                  <option>Diversified Portfolio (APY 9.1%)</option>
                  <option>Balanced Growth (APY 8.0%)</option>
                </select>
              </div>

              {/* Contribution Schedule */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Jadwal Kontribusi</label>
                <select className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Mingguan</option>
                  <option>Bulanan</option>
                  <option>Fleksibel</option>
                </select>
              </div>

              {/* Action Buttons Step 1 */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateGroupStep(1);
                  }}
                  className="flex-1 py-3 border-2 border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700/30 transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={() => setCreateGroupStep(2)}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  Lanjut
                </button>
              </div>
              </>
              ) : (
                // Step 2: Invite Members
                <>
                  {/* Invite Link Section */}
                  <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
                    <h3 className="text-subheading text-white mb-3">Link Undangan Grup</h3>
                    <p className="text-sm text-slate-400 mb-4">Bagikan link ini untuk mengundang teman</p>
                    <div className="flex items-center gap-2 p-4 bg-slate-700/50 rounded-xl mb-4">
                      <input
                        type="text"
                        value="https://kita.app/join/abc123xyz"
                        readOnly
                        className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                      />
                      <button className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors">
                        <Copy className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                    <button className="w-full flex items-center justify-center gap-3 p-4 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-semibold">Share via WhatsApp</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-slate-600/50"></div>
                    <span className="text-sm text-slate-400">atau</span>
                    <div className="flex-1 h-px bg-slate-600/50"></div>
                  </div>

                  {/* Invite KITA Users */}
                  <div>
                    <h3 className="text-subheading text-white mb-4">Cari & Undang Pengguna KITA</h3>
                    <p className="text-sm text-slate-400 mb-4">Undang teman yang sudah punya akun KITA</p>
                    
                    {/* Search Bar */}
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Cari berdasarkan username..."
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Suggested Users */}
                    <div className="space-y-3">
                      {suggestedFriends.map((friend) => (
                        <label
                          key={friend.id}
                          className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl cursor-pointer hover:bg-slate-700/50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFriends.includes(friend.id)}
                            onChange={() => toggleFriendSelection(friend.id)}
                            className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-purple-500"
                          />
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {friend.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold">{friend.name}</p>
                            <p className="text-sm text-slate-400">{friend.username}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    {selectedFriends.length > 0 && (
                      <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                        <p className="text-sm text-purple-400">
                          {selectedFriends.length} teman dipilih
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons Step 2 */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setCreateGroupStep(1)}
                      className="flex-1 py-3 border-2 border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700/30 transition-all"
                    >
                      Kembali
                    </button>
                    <button 
                      onClick={() => {
                        setShowCreateModal(false);
                        setCreateGroupStep(1);
                        setSelectedFriends([]);
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                    >
                      {selectedFriends.length > 0 ? 'Kirim Undangan' : 'Selesai'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 rounded-3xl max-w-md w-full border border-slate-700/50">
            {/* Modal Header */}
            <div className="border-b border-slate-700/50 p-6 flex items-center justify-between">
              <h2 className="text-heading text-white">Ajak Teman</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-10 h-10 bg-slate-700/50 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <p className="text-slate-400">Bagikan link ini ke teman dan keluarga untuk join grup</p>

              {/* Invite Link */}
              <div className="flex items-center gap-2 p-4 bg-slate-700/50 rounded-xl">
                <input
                  type="text"
                  value="https://kita.app/join/abc123"
                  readOnly
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                />
                <button className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors">
                  <Copy className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Share Options */}
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-4 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">Share via WhatsApp</span>
                </button>
                <button className="w-full flex items-center gap-3 p-4 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="font-semibold">Share via Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ChatBot />
    </>
  );
}
