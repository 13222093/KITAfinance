'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { TrendingUp, Users, Sparkles, ArrowRight, Play, Zap, Shield, Trophy, ChevronDown, Coins, DollarSign } from 'lucide-react';

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />

      {/* Hero Section - Mobile-Native, Vibrant Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A4A7C] via-[#0A98FF] to-[#04877f]">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,152,255,0.3),transparent_50%)] animate-pulse" />

        {/* Floating orbs - Split complementary colors */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#C15BFF] rounded-full blur-3xl opacity-30 animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FBFF2B] rounded-full blur-3xl opacity-20 animate-float-delayed" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#00FFF0] rounded-full blur-3xl opacity-25 animate-float-slow" />
        </div>

        {/* Floating icons - Gamified Finance Elements */}
        {/* Sparkles - Top Right */}
        <div className="absolute top-28 right-2 md:right-15 animate-bounce">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#FFBC57] to-[#FF9500] rounded-2xl flex items-center justify-center shadow-2xl rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* TrendingUp - Bottom Left (Green = Bullish Stock) */}
        <div className="absolute bottom-32 left-8 md:left-40">
          <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center shadow-xl -rotate-12 backdrop-blur-sm border-2 border-white/30">
            <TrendingUp className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Coins - Top Left (Spinning + Bouncing) */}
        <div className="absolute top-32 left-2 md:left-24">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/40 animate-bounce">
            <Coins className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Trophy Badge - Bottom Left (above CTA button) */}
        <div className="absolute bottom-60 left-5 md:left-16 animate-bounce" style={{ animationDelay: '0.5s' }}>
          <div className="w-14 h-14 bg-gradient-to-br from-[#A855F7] to-[#9333EA] rounded-2xl flex items-center justify-center shadow-2xl rotate-6 backdrop-blur-sm border-2 border-white/30">
            <Trophy className="w-7 h-7 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Dollar Sign - Bottom Right */}
        <div className="absolute bottom-40 right-12 md:right-32 animate-pulse" style={{ animationDelay: '1s' }}>
          <div className="w-10 h-10 bg-gradient-to-br from-[#06B6D4] to-[#0284C7] rounded-lg flex items-center justify-center shadow-xl backdrop-blur-sm border-2 border-white/30">
            <DollarSign className="w-5 h-5 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Percentage Badge - Middle Right */}
        <div className="hidden lg:block absolute top-1/2 right-16 -translate-y-1/2 animate-bounce" style={{ animationDelay: '0.3s' }}>
          <div className="px-4 py-2 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full shadow-2xl backdrop-blur-sm border-2 border-white/40 rotate-12">
            <span className="text-white font-black text-lg drop-shadow-lg">+15%</span>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-24 sm:pt-32">
          {/* Badge - Cyan accent */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border-2 border-[#1fffab]/40 rounded-full px-5 py-2.5 mb-6 shadow-lg">
            <div className="w-2 h-2 bg-[#1fffab] rounded-full animate-pulse" />
            <span className="text-white font-semibold text-sm tracking-wide">Powered by Thetanuts V4</span>
          </div>

          {/* Main Headline - Logo only */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            KITA<span className="font-serif italic font-light tracking-wide">finance</span>
          </h1>

          {/* Subheadline - Trading tagline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">
            <span className="text-white">
              Trading <span className="text-[#FFBC57]">option</span> jadi seru
            </span>
          </h2>

          {/* Value Proposition */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-10 leading-relaxed font-medium">
            Beli Crypto di harga murah dan dapat <span className="text-[#FFBC57] font-bold">cashback instant</span>.
            Nabung bareng temen, keluarga, atau sendiri sambil kumpulin XP, badges, dan selesaikan misi! 💎
          </p>

          {/* CTA Buttons - Complementary amber primary */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/onboarding"
              className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white px-8 py-4 rounded-2xl font-bold text-lg
                         shadow-[0_8px_0_0_rgba(255,149,0,0.4)] hover:shadow-[0_12px_0_0_rgba(255,149,0,0.4)] hover:-translate-y-1
                         active:translate-y-2 active:shadow-[0_4px_0_0_rgba(255,149,0,0.4)] transition-all duration-200
                         border-2 border-white/20"
            >
              Mulai Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg
                         hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-200"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Lihat Demo
            </Link>
          </div>

          {/* Stats - Mobile-first optimized grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 border-2 border-white/20">
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-[#00FFF0] drop-shadow-lg">$2.4M+</p>
              <p className="text-white/80 text-[10px] sm:text-xs md:text-sm mt-1 font-semibold leading-tight">Total Value Locked</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 border-2 border-white/20">
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FBFF2B] drop-shadow-lg">18.5%</p>
              <p className="text-white/80 text-[10px] sm:text-xs md:text-sm mt-1 font-semibold leading-tight">Avg APY</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-6 border-2 border-white/20">
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-[#C15BFF] drop-shadow-lg">1,250+</p>
              <p className="text-white/80 text-[10px] sm:text-xs md:text-sm mt-1 font-semibold leading-tight">Active Users</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - Animated */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <ChevronDown className="w-6 h-6 text-white/60" />
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-[#00FFF0] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Why KITA Section - Gamification Value Props */}
      <section className="relative py-20 sm:py-24 overflow-hidden bg-gradient-to-br from-[#FFBC57] via-[#FF9500] to-[#F97316]">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,188,87,0.3),transparent_50%)] animate-pulse" />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-20 w-64 h-64 bg-[#00FFF0] rounded-full blur-3xl opacity-20 animate-float" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#C15BFF] rounded-full blur-3xl opacity-15 animate-float-delayed" />
        </div>

        {/* Floating Icons - Gamification Theme */}
        {/* Trophy - Top Right */}
        <div className="absolute top-20 right-8 md:right-20 animate-bounce" style={{ animationDelay: '0.2s' }}>
          <div className="w-16 h-16 bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/40">
            <Trophy className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Coins - Bottom Left (Spinning) */}
        <div className="absolute bottom-24 left-8 md:left-16 animate-spin-slow">
          <div className="w-14 h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center shadow-xl rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Coins className="w-7 h-7 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Zap - Middle Right */}
        <div className="hidden lg:block absolute top-1/2 right-12 -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.6s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#C15BFF] to-[#9333EA] rounded-2xl flex items-center justify-center shadow-2xl -rotate-6 backdrop-blur-sm border-2 border-white/30">
            <Zap className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Sparkles Badge - Top Left */}
        <div className="absolute top-32 left-12 md:left-24 animate-bounce" style={{ animationDelay: '0.4s' }}>
          <div className="px-3 py-2 bg-gradient-to-r from-[#0A98FF] to-[#06B6D4] rounded-full shadow-2xl backdrop-blur-sm border-2 border-white/40 -rotate-12">
            <Sparkles className="w-5 h-5 text-white drop-shadow-lg" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-lg mb-4">
              Investasi Crypto yang <span className="text-[#FBFF2B]">Seru</span> & <span className="text-[#00FFF0]">Menguntungkan</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Bukan cuma nabung biasa—dapatkan cashback instant dan main game sambil investasi!
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Card 1: Cashback Instant */}
            <div className="group bg-white/15 backdrop-blur-md border-4 border-white/30 rounded-3xl p-6 sm:p-8 shadow-2xl hover:scale-105 hover:border-[#00FFF0]/60 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] rounded-2xl flex items-center justify-center shadow-xl rotate-6">
                  <DollarSign className="w-7 h-7 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">Cashback Instant 💰</h3>
                  <p className="text-white/80 text-sm sm:text-base">Dapat premium langsung</p>
                </div>
              </div>
              <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                Beli Crypto di harga murah dan langsung dapat <span className="text-[#FBFF2B] font-bold">cashback instant</span>. Uangnya masuk ke wallet kamu sekarang juga!
              </p>
            </div>

            {/* Card 2: Gamification */}
            <div className="group bg-white/15 backdrop-blur-md border-4 border-white/30 rounded-3xl p-6 sm:p-8 shadow-2xl hover:scale-105 hover:border-[#FBFF2B]/60 transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FBFF2B] to-[#FBBF24] rounded-2xl flex items-center justify-center shadow-xl -rotate-6">
                  <Trophy className="w-7 h-7 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">Main Sambil Nabung 🎮</h3>
                  <p className="text-white/80 text-sm sm:text-base">Investasi jadi game seru</p>
                </div>
              </div>
              <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                Kumpulin <span className="text-[#00FFF0] font-bold">XP</span>, raih <span className="text-[#C15BFF] font-bold">badges</span>, selesaikan <span className="text-[#10B981] font-bold">misi harian</span>, dan compete di leaderboard. Nabung bareng temen atau solo!
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="min-h-screen bg-gradient-to-br from-white via-[#F0F9FF] to-white">

        {/* Features Section - Mobile-first cards */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block bg-gradient-to-r from-[#0A98FF] to-[#00FFF0] text-white px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-lg">
                ⚡ CARA KERJA
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A4A7C] mb-4">
                Mulai Investasi dalam <span className="text-[#0A98FF]">3 Langkah</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Mudah, cepat, dan fun! Cuan sambil main strategi DeFi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Step 1 - Amber accent */}
              <div className="group relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-[#FFBC57]/20 hover:border-[#FFBC57] hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#FFBC57] to-[#FF9500] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg rotate-12">
                  1
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFBC57] to-[#FF9500] flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  💰
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0A4A7C] mb-3">Pilih Mode Nabung</h3>
                <p className="text-gray-700 leading-relaxed">
                  Nabung <span className="font-bold text-[#0A98FF]">sendiri</span> atau <span className="font-bold text-[#C15BFF]">ajak teman</span> nabung bareng. Pilih strategi yang kamu mau!
                </p>
              </div>

              {/* Step 2 - Cyan accent */}
              <div className="group relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-[#00FFF0]/20 hover:border-[#00FFF0] hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg rotate-12">
                  2
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  🎯
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0A4A7C] mb-3">Atur Target & Deposit</h3>
                <p className="text-gray-700 leading-relaxed">
                  Tentukan <span className="font-bold text-[#00FFF0]">target harga</span> dan strategi DeFi. Deposit USDC kamu dan mulai dapat cuan.
                </p>
              </div>

              {/* Step 3 - Purple/Yellow accent */}
              <div className="group relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-[#C15BFF]/20 hover:border-[#C15BFF] hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-[#C15BFF] to-[#FBFF2B] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg rotate-12">
                  3
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C15BFF] to-[#FBFF2B] flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  ⚡
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0A4A7C] mb-3">Raih Cuan & XP</h3>
                <p className="text-gray-700 leading-relaxed">
                  Dapat <span className="font-bold text-[#FFBC57]">cashback instant</span>, kumpulin XP, ajak teman, dan <span className="font-bold text-[#C15BFF]">level up</span>!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Vibrant gradient background */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#0A98FF] via-[#00FFF0] to-[#0A98FF] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#FFBC57] rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold mb-4 border-2 border-white/30">
                ✨ KEUNGGULAN
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                Kenapa Pilih KITA?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                Platform DeFi Options Pertama untuk Indonesia 🇮🇩
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Benefit 1 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 hover:scale-105 hover:shadow-[0_20px_60px_rgba(10,152,255,0.4)] transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C15BFF] to-[#0A98FF] flex items-center justify-center mb-4 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-[#0A4A7C] mb-2">Solo atau Bareng</h3>
                <p className="text-gray-700">
                  Nabung sendiri atau ajak teman dalam satu vault. <span className="font-bold text-[#0A98FF]">Voting system</span> untuk keputusan grup.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 hover:scale-105 hover:shadow-[0_20px_60px_rgba(0,255,240,0.4)] transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] flex items-center justify-center mb-4 shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-[#0A4A7C] mb-2">Banyak Strategi</h3>
                <p className="text-gray-700">
                  Cash secured put, covered call, buy call, buy put. Pilih sesuai <span className="font-bold text-[#00FFF0]">risk appetite</span>.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 hover:scale-105 hover:shadow-[0_20px_60px_rgba(251,255,43,0.4)] transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FBFF2B] to-[#FFBC57] flex items-center justify-center mb-4 shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-[#0A4A7C] mb-2">Gamifikasi Seru</h3>
                <p className="text-gray-700">
                  Kumpulin XP, unlock badges, maintain streaks. <span className="font-bold text-[#FBFF2B]">Investing yang fun!</span>
                </p>
              </div>

              {/* Benefit 4 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 hover:scale-105 hover:shadow-[0_20px_60px_rgba(255,188,87,0.4)] transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFBC57] to-[#FF9500] flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-[#0A4A7C] mb-2">Cepat & Murah</h3>
                <p className="text-gray-700">
                  Built on <span className="font-bold text-[#FFBC57]">Base Network</span>. Gas fees rendah, settlement cepat.
                </p>
              </div>

              {/* Benefit 5 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 hover:scale-105 hover:shadow-[0_20px_60px_rgba(193,91,255,0.4)] transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C15BFF] to-[#FBFF2B] flex items-center justify-center mb-4 shadow-lg">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-[#0A4A7C] mb-2">Reward & Achievements</h3>
                <p className="text-gray-700">
                  Misi harian, referral bonus, seasonal campaigns. Makin aktif, <span className="font-bold text-[#C15BFF]">makin cuan!</span>
                </p>
              </div>

              {/* Benefit 6 */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-2 border-white/50 hover:scale-105 hover:shadow-[0_20px_60px_rgba(10,152,255,0.4)] transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A98FF] to-[#0A4A7C] flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-[#0A4A7C] mb-2">Aman & Transparan</h3>
                <p className="text-gray-700">
                  Smart contract audited, on-chain transparency, <span className="font-bold text-[#0A98FF]">security-first</span> design.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Final push */}
        <section className="py-20 bg-gradient-to-r from-[#0A4A7C] via-[#0A98FF] to-[#00FFF0] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6">
              Siap Mulai Investasi <span className="text-[#FBFF2B]">Tanpa Ambyar?</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join ribuan investor yang sudah dapat cuan dari DeFi options. Gratis, mudah, dan fun!
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white px-10 py-5 rounded-2xl font-black text-xl
                         shadow-[0_10px_0_0_rgba(255,149,0,0.5)] hover:shadow-[0_15px_0_0_rgba(255,149,0,0.5)] hover:-translate-y-1
                         active:translate-y-2 active:shadow-[0_5px_0_0_rgba(255,149,0,0.5)] transition-all duration-200
                         border-2 border-white/30"
            >
              Mulai Sekarang - Gratis!
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </section>
      </main>

      {/* Scroll to Top Button - Vibrant */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-14 h-14 bg-gradient-to-br from-[#0A98FF] to-[#00FFF0] hover:from-[#00FFF0] hover:to-[#0A98FF] text-white rounded-full flex items-center justify-center
                     shadow-[0_6px_0_0_rgba(10,152,255,0.4)] hover:shadow-[0_10px_0_0_rgba(0,255,240,0.4)] hover:-translate-y-1
                     active:translate-y-1 active:shadow-[0_3px_0_0_rgba(10,152,255,0.4)] transition-all duration-200
                     border-2 border-white/30"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* Footer - Clean and modern */}
      <footer className="border-t-4 border-[#0A98FF]/20 py-12 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-3xl font-black bg-gradient-to-r from-[#0A98FF] via-[#00FFF0] to-[#C15BFF] bg-clip-text text-transparent">
                KITA
              </p>
              <p className="text-sm text-gray-600 mt-1 font-medium">Kolektif Investasi Tanpa Ambyar</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-700 font-semibold">
                Built on <span className="text-[#0A98FF] font-black">Base Network</span> ⚡
              </p>
              <p className="text-sm text-gray-500 mt-1">© 2026 KITA. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
