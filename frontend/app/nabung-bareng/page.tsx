'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { Users, TrendingUp, Clock, Target, Shield, Plus, Copy, MessageCircle, X, ArrowRight, Award, Calendar, DollarSign, CheckCircle, Share2, Sparkles, Trophy, Coins, Zap, Heart } from 'lucide-react';
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

      {/* HERO SECTION - Purple/Blue Gradient */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#C15BFF] via-[#0A98FF] to-[#0A4A7C] pt-24 pb-16">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(193,91,255,0.3),transparent_50%)] animate-pulse" />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#FBFF2B] rounded-full blur-3xl opacity-30 animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#00FFF0] rounded-full blur-3xl opacity-20 animate-float-delayed" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#FFBC57] rounded-full blur-3xl opacity-25 animate-float-slow" />
        </div>

        {/* Floating Icons - Group Theme */}
        {/* Users Icon - Top Right (Bouncing) */}
        <div className="absolute top-24 right-8 md:right-20 animate-bounce">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] rounded-2xl flex items-center justify-center shadow-2xl rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Users className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Heart Icon - Top Left (Pulsing - representing friendship) */}
        <div className="absolute top-32 left-12 md:left-24 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B9D] to-[#C15BFF] rounded-xl flex items-center justify-center shadow-xl -rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Heart className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Trophy - Bottom Left (Rotating slowly) */}
        <div className="absolute bottom-32 left-8 md:left-20 animate-spin-slow">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/40">
            <Trophy className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Target Badge - Middle Right */}
        <div className="hidden lg:block absolute top-1/2 right-16 -translate-y-1/2 animate-bounce" style={{ animationDelay: '0.3s' }}>
          <div className="w-14 h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center shadow-2xl rotate-6 backdrop-blur-sm border-2 border-white/30">
            <Target className="w-7 h-7 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Sparkles - Bottom Right */}
        <div className="absolute bottom-40 right-12 md:right-32 animate-pulse" style={{ animationDelay: '1s' }}>
          <div className="w-10 h-10 bg-gradient-to-br from-[#FFBC57] to-[#FF9500] rounded-lg flex items-center justify-center shadow-xl backdrop-blur-sm border-2 border-white/30">
            <Sparkles className="w-5 h-5 text-white drop-shadow-lg" />
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-block bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold mb-6 border-2 border-white/30 shadow-lg">
            👥 NABUNG BARENG
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            Investasi Lebih <span className="text-[#FFBC57]">Seru</span> Bareng Teman!
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Gabung atau buat grup investasi, voting strategi bareng, dan raih target lebih cepat. <span className="font-bold">Cuan bareng lebih fun! 🚀</span>
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFBC57] to-[#FF9500] hover:from-[#FF9500] hover:to-[#FFBC57] rounded-2xl transition-all text-white font-black text-lg shadow-[0_8px_0_0_rgba(255,149,0,0.5)] hover:shadow-[0_10px_0_0_rgba(255,149,0,0.5)] hover:-translate-y-1 active:translate-y-1 active:shadow-[0_4px_0_0_rgba(255,149,0,0.5)] border-4 border-white/30"
          >
            <Plus className="w-6 h-6" />
            Buat Grup Sekarang
          </button>
        </div>
      </section>

      {/* BENEFITS SECTION - Cyan/Teal Gradient */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-[#00FFF0] via-[#0A98FF] to-[#04877f]">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,255,240,0.3),transparent_50%)] animate-pulse" />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-20 w-64 h-64 bg-[#C15BFF] rounded-full blur-3xl opacity-20 animate-float" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-[#FBFF2B] rounded-full blur-3xl opacity-15 animate-float-delayed" />
        </div>

        {/* Floating Icons - Benefits Theme */}
        {/* Award Badge - Top Left */}
        <div className="absolute top-16 left-8 md:left-16 animate-bounce" style={{ animationDelay: '0.2s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#FBFF2B] to-[#FFBC57] rounded-xl flex items-center justify-center shadow-xl rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Award className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Trending Up - Bottom Right */}
        <div className="absolute bottom-16 right-8 md:right-16 animate-pulse" style={{ animationDelay: '0.8s' }}>
          <div className="w-14 h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center shadow-2xl -rotate-12 backdrop-blur-sm border-2 border-white/30">
            <TrendingUp className="w-7 h-7 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Percentage Badge - Middle Left */}
        <div className="hidden md:block absolute top-1/2 left-12 -translate-y-1/2 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <div className="px-3 py-2 bg-gradient-to-r from-[#C15BFF] to-[#A855F7] rounded-full shadow-2xl backdrop-blur-sm border-2 border-white/40 -rotate-12">
            <span className="text-white font-black text-base drop-shadow-lg">+20%</span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-[#C15BFF] to-[#FBFF2B] text-white px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
              ✨ KEUNTUNGAN
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 drop-shadow-lg">
              Kenapa Harus Nabung Bareng?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Lebih dari sekedar investasi - ini adalah <span className="font-bold text-[#FFBC57]">social DeFi experience!</span>
            </p>
          </div>

          <div className="overflow-hidden -mx-4 md:mx-0">
            <div className="flex gap-4 px-4 md:px-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                const gradients = [
                  { from: '#C15BFF', to: '#0A98FF', shadow: 'rgba(193,91,255,0.4)' },
                  { from: '#00FFF0', to: '#0A98FF', shadow: 'rgba(0,255,240,0.4)' },
                  { from: '#FFBC57', to: '#FF9500', shadow: 'rgba(255,188,87,0.4)' },
                  { from: '#FBFF2B', to: '#C15BFF', shadow: 'rgba(251,255,43,0.4)' },
                ];
                const gradient = gradients[index % gradients.length];

                return (
                  <div
                    key={index}
                    className="group w-[240px] min-w-[240px] md:w-auto md:min-w-0 flex-shrink-0 snap-start bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl md:shadow-2xl border-2 md:border-4 border-white/50 hover:scale-105 hover:-translate-y-2 transition-all duration-300"
                    style={{
                      boxShadow: `0 20px 60px ${gradient.shadow}`
                    }}
                  >
                    <div
                      className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
                      }}
                    >
                      <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-[#0A4A7C] mb-1 md:mb-2 text-center">{benefit.title}</h3>
                    <p className="text-sm md:text-base text-gray-700 text-center leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* MY GROUPS SECTION - Orange/Yellow Gradient */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-[#FFBC57] via-[#FF9500] to-[#F97316]">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,188,87,0.3),transparent_50%)] animate-pulse" />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-20 w-64 h-64 bg-[#00FFF0] rounded-full blur-3xl opacity-20 animate-float" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#C15BFF] rounded-full blur-3xl opacity-15 animate-float-delayed" />
        </div>

        {/* Floating Icons - Group Management Theme */}
        {/* Coins - Top Right (Spinning) */}
        <div className="absolute top-20 right-8 md:right-20 animate-spin-slow">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/40">
            <Coins className="w-7 h-7 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Users Group - Bottom Left */}
        <div className="absolute bottom-24 left-8 md:left-16 animate-bounce" style={{ animationDelay: '0.4s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#0A98FF] to-[#0284C7] rounded-xl flex items-center justify-center shadow-xl rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Users className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Zap - Middle Right */}
        <div className="hidden lg:block absolute top-1/2 right-12 -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.6s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#C15BFF] to-[#9333EA] rounded-2xl flex items-center justify-center shadow-2xl -rotate-6 backdrop-blur-sm border-2 border-white/30">
            <Zap className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Dollar Badge - Top Left */}
        <div className="absolute top-32 left-12 md:left-24 animate-bounce" style={{ animationDelay: '0.2s' }}>
          <div className="px-3 py-2 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full shadow-2xl backdrop-blur-sm border-2 border-white/40 rotate-12">
            <span className="text-white font-black text-base drop-shadow-lg">$$$</span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg">Grup Saya</h2>
              <p className="text-white/90 mt-2">Kelola dan pantau semua grup investasimu</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/30">
              <span className="text-white font-bold">{myGroups.length} Grup Aktif</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {myGroups.map((group, index) => {
              const progress = (group.currentAmount / group.targetAmount) * 100;
              const cardGradients = [
                { border: '#C15BFF', badge: 'from-[#C15BFF] to-[#0A98FF]', progress: 'from-[#C15BFF] to-[#0A98FF]', shadow: 'rgba(193,91,255,0.3)' },
                { border: '#00FFF0', badge: 'from-[#00FFF0] to-[#0A98FF]', progress: 'from-[#00FFF0] to-[#0A98FF]', shadow: 'rgba(0,255,240,0.3)' },
                { border: '#FFBC57', badge: 'from-[#FFBC57] to-[#FF9500]', progress: 'from-[#FFBC57] to-[#FF9500]', shadow: 'rgba(255,188,87,0.3)' },
              ];
              const cardStyle = cardGradients[index % cardGradients.length];

              return (
                <Link
                  key={group.id}
                  href={`/nabung-bareng/${group.id}`}
                  className="group block bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-white/50 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  style={{
                    boxShadow: `0 20px 60px ${cardStyle.shadow}`
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black text-[#0A4A7C] group-hover:text-[#0A98FF] transition-colors">{group.name}</h3>
                        <span
                          className={`px-3 py-1 bg-gradient-to-r ${cardStyle.badge} text-white text-xs font-bold rounded-full shadow-md`}
                        >
                          {group.role}
                        </span>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                          <Users className="w-4 h-4 text-[#0A98FF]" />
                          <span className="font-semibold">{group.members} Members</span>
                        </span>
                        <span className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-green-600">APY {group.apy}%</span>
                        </span>
                        <span className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span className="font-semibold text-amber-600">{group.nextContribution}</span>
                        </span>
                      </div>
                    </div>

                    {/* Progress Badge */}
                    <div className="text-right">
                      <div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cardStyle.badge} flex flex-col items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}
                      >
                        <span className="text-2xl font-black text-white">{Math.round(progress)}%</span>
                        <span className="text-xs text-white/80 font-semibold">Progress</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                      <div
                        className={`h-full bg-gradient-to-r ${cardStyle.progress} rounded-full transition-all duration-500 shadow-md`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-gray-600 font-semibold">
                        Rp {(group.currentAmount / 1000000).toFixed(1)}jt
                      </span>
                      <span className="text-[#0A4A7C] font-bold">
                        Target: Rp {(group.targetAmount / 1000000).toFixed(1)}jt
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                    <span className="text-sm text-gray-600">
                      Strategi: <span className="font-bold text-[#0A98FF]">{group.strategy}</span>
                    </span>
                    <div className="flex items-center gap-2 text-[#0A98FF] font-bold text-sm group-hover:gap-3 transition-all">
                      <span>Lihat Detail</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Empty State */}
          {myGroups.length === 0 && (
            <div className="text-center py-16 bg-white/95 backdrop-blur-sm rounded-3xl border-4 border-white/50 shadow-2xl">
              <div className="w-24 h-24 bg-gradient-to-br from-[#C15BFF] to-[#FBFF2B] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-black text-[#0A4A7C] mb-2">Belum Ada Grup</h3>
              <p className="text-gray-600 mb-6">Buat grup pertamamu dan mulai investasi bareng teman!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-5 h-5" />
                Buat Grup Pertama
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#0A4A7C]/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/15 backdrop-blur-md rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-white/20">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b-2 border-white/20 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-heading text-white mb-1">
                  {createGroupStep === 1 ? 'Buat Grup Baru' : 'Ajak Teman'}
                </h2>
                <p className="text-body text-white/70">
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
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
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
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00FFF0]"
                    />
                  </div>

                  {/* Target Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Target Dana</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">Rp</span>
                      <input
                        type="number"
                        placeholder="50.000.000"
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00FFF0]"
                      />
                    </div>
                  </div>

                  {/* Max Members */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Maksimal Anggota</label>
                    <input
                      type="number"
                      placeholder="10"
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00FFF0]"
                    />
                  </div>

                  {/* Action Buttons Step 1 */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setCreateGroupStep(1);
                      }}
                      className="flex-1 py-3 border-2 border-white/40 text-white rounded-xl hover:bg-white/10 transition-all font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => setCreateGroupStep(2)}
                      className="flex-1 py-3 bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white rounded-xl font-bold shadow-[0_6px_0_0_rgba(255,149,0,0.4)] hover:shadow-[0_8px_0_0_rgba(255,149,0,0.4)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_0_rgba(255,149,0,0.4)] transition-all border-2 border-white/20"
                    >
                      Lanjut
                    </button>
                  </div>
                </>
              ) : (
                // Step 2: Invite Members
                <>
                  {/* Invite Link Section */}
                  <div className="bg-white/10 border-2 border-white/20 rounded-xl p-6">
                    <h3 className="text-subheading text-white mb-3">Link Undangan Grup</h3>
                    <p className="text-sm text-white/70 mb-4">Bagikan link ini untuk mengundang teman</p>
                    <div className="flex items-center gap-2 p-4 bg-white/10 rounded-xl mb-4">
                      <input
                        type="text"
                        value="https://kita.app/join/abc123xyz"
                        readOnly
                        className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                      />
                      <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <Copy className="w-5 h-5 text-white/70" />
                      </button>
                    </div>
                    <button className="w-full flex items-center justify-center gap-3 p-4 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors font-semibold">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-semibold">Share via Telegram</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/20"></div>
                    <span className="text-sm text-white/70">atau</span>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </div>

                  {/* Invite KITA Users */}
                  <div>
                    <h3 className="text-subheading text-white mb-4">Cari & Undang Pengguna KITA</h3>
                    <p className="text-sm text-white/70 mb-4">Undang teman yang sudah punya akun KITA</p>

                    {/* Search Bar */}
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Cari berdasarkan username..."
                        className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00FFF0]"
                      />
                    </div>

                    {/* Suggested Users */}
                    <div className="space-y-3">
                      {suggestedFriends.map((friend) => (
                        <label
                          key={friend.id}
                          className="flex items-center gap-4 p-4 bg-white/10 rounded-xl cursor-pointer hover:bg-white/15 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFriends.includes(friend.id)}
                            onChange={() => toggleFriendSelection(friend.id)}
                            className="w-5 h-5 text-[#A855F7] rounded focus:ring-2 focus:ring-[#A855F7]"
                          />
                          <div className="w-12 h-12 bg-gradient-to-br from-[#0284C7] to-[#06B6D4] rounded-xl flex items-center justify-center text-white font-bold">
                            {friend.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold">{friend.name}</p>
                            <p className="text-sm text-white/70">{friend.username}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    {selectedFriends.length > 0 && (
                      <div className="mt-4 p-4 bg-[#A855F7]/10 border-2 border-[#A855F7]/20 rounded-xl">
                        <p className="text-sm text-[#A855F7]">
                          {selectedFriends.length} teman dipilih
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons Step 2 */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setCreateGroupStep(1)}
                      className="flex-1 py-3 border-2 border-white/40 text-white rounded-xl hover:bg-white/10 transition-all font-semibold"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setCreateGroupStep(1);
                        setSelectedFriends([]);
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white rounded-xl font-bold shadow-[0_6px_0_0_rgba(255,149,0,0.4)] hover:shadow-[0_8px_0_0_rgba(255,149,0,0.4)] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_3px_0_0_rgba(255,149,0,0.4)] transition-all border-2 border-white/20"
                    >
                      {selectedFriends.length > 0 ? 'Kirim Undangan' : 'Selesai'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )
      }

      {/* Invite Modal */}
      {
        showInviteModal && (
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
        )
      }

      <ChatBot />
    </>
  );
}
