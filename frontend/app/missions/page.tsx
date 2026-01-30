'use client';

import { Navbar } from '@/components/Navbar';
import { ChatBot } from '@/components/ChatBot';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { AchievementBadge } from '@/components/gamification/AchievementBadge';
import {
  Award, CheckCircle, Circle, ArrowRight, Trophy, Star,
  Flame, Zap, Gift, Calendar, Target, Rocket, Crown,
  Medal, Sparkles, TrendingUp, Users, ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Mission {
  id: number;
  title: string;
  description: string;
  xp: number;
  isCompleted: boolean;
  category: string;
  progress?: number;
  maxProgress?: number;
}

interface Badge {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'trading' | 'social' | 'streak' | 'milestone';
  progress?: number;
  maxProgress?: number;
}

export default function Missions() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/missions`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMissions(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleComplete = (id: number) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, isCompleted: true } : m));
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/missions/${id}/complete`, {
      method: 'POST'
    });
  };

  // Dummy data for gamification elements
  const userStats = {
    currentXP: 2450,
    levelXP: 3000,
    level: 8,
    totalXP: 12450,
    missionsCompleted: 47,
    badgesEarned: 12,
    currentRank: 24
  };

  const streakData = {
    currentStreak: 7,
    longestStreak: 21
  };

  const currentCampaign = {
    name: "Valentine Nabung Bareng",
    emoji: "💝",
    description: "Nabung bareng dengan pasangan, dapat bonus premium +20%!",
    endDate: new Date('2026-02-14'),
    reward: "Power Couple Badge + 500k bonus",
    participants: 1234,
    isActive: true
  };

  const badges: Badge[] = [
    { title: "First Blood", description: "Profit pertama kali", icon: "🎖️", unlocked: true, category: "trading", unlockedAt: new Date('2026-01-15') },
    { title: "Streak Master", description: "5 minggu profit berturut", icon: "🔥", unlocked: true, category: "streak", unlockedAt: new Date('2026-01-20') },
    { title: "Social Butterfly", description: "Grup 10+ orang", icon: "👥", unlocked: false, category: "social", progress: 6, maxProgress: 10 },
    { title: "Whale Hunter", description: "1 posisi 50M+", icon: "🐋", unlocked: false, category: "trading" },
    { title: "Diamond Hands", description: "Hold sampai expiry", icon: "💎", unlocked: true, category: "trading", unlockedAt: new Date('2026-01-10') },
    { title: "Sharpshooter", description: "10 posisi profitable", icon: "🎯", unlocked: false, category: "trading", progress: 7, maxProgress: 10 },
    { title: "Legend", description: "Reach Level 10", icon: "🏆", unlocked: false, category: "milestone", progress: 8, maxProgress: 10 },
    { title: "Early Bird", description: "Login pagi 7 hari", icon: "🌅", unlocked: false, category: "streak" }
  ];

  const leaderboardPreview = [
    { rank: 1, username: "CryptoNinja", xp: 25400, level: 12 },
    { rank: 2, username: "DiamondHands", xp: 22100, level: 11 },
    { rank: 3, username: "MoonBoy", xp: 19800, level: 10 },
    { rank: 4, username: "HODLER", xp: 17500, level: 10 },
    { rank: 5, username: "You", xp: userStats.totalXP, level: userStats.level }
  ];

  const totalXP = missions.reduce((acc, m) => m.isCompleted ? acc + m.xp : acc, 0);
  const dailyMissions = missions.filter(m => m.category === 'daily');
  const weeklyMissions = missions.filter(m => m.category === 'weekly');
  const specialMissions = missions.filter(m => !['daily', 'weekly'].includes(m.category));

  // Calculate time remaining for campaign
  const getTimeRemaining = () => {
    const now = new Date();
    const diff = currentCampaign.endDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours };
  };

  const timeRemaining = getTimeRemaining();

  return (
    <>
      <Navbar />

      {/* HERO SECTION - XP Stats Dashboard */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#C15BFF] via-[#0A98FF] to-[#04877f] pt-24 pb-16">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(193,91,255,0.3),transparent_50%)] animate-pulse" />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#FFBC57] rounded-full blur-3xl opacity-30 animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#00FFF0] rounded-full blur-3xl opacity-20 animate-float-delayed" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-[#FBFF2B] rounded-full blur-3xl opacity-25 animate-float-slow" />
        </div>

        {/* Floating icons */}
        {/* Trophy - Top Right */}
        <div className="absolute top-24 right-8 md:right-20 animate-bounce">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-2xl flex items-center justify-center shadow-2xl rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Trophy className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Star - Bottom Left */}
        <div className="absolute bottom-32 left-8 md:left-20 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#FFBC57] to-[#FF9500] rounded-xl flex items-center justify-center shadow-xl -rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Star className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Fire - Top Left */}
        <div className="absolute top-32 left-12 md:left-24 animate-bounce" style={{ animationDelay: '0.2s' }}>
          <div className="w-16 h-16 bg-gradient-to-br from-[#F59E0B] to-[#DC2626] rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/40">
            <Flame className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Zap - Middle Right */}
        <div className="hidden lg:block absolute top-1/2 right-12 -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.8s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#C15BFF] to-[#9333EA] rounded-2xl flex items-center justify-center shadow-2xl -rotate-6 backdrop-blur-sm border-2 border-white/30">
            <Zap className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-block bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold mb-6 border-2 border-white/30 shadow-lg">
            ⚡ GAMIFICATION HUB
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            Level Up & Earn Rewards!
          </h1>

          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Selesaikan misi, kumpulkan badge, dan naik peringkat untuk unlock reward eksklusif! 🚀
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-4 border-white/50 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-[#C15BFF] to-[#0A98FF] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-black text-[#0A4A7C] mb-1">{userStats.totalXP.toLocaleString()}</p>
              <p className="text-xs text-gray-600 font-bold">Total XP</p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-4 border-white/50 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFBC57] to-[#FF9500] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-black text-[#0A4A7C] mb-1">#{userStats.currentRank}</p>
              <p className="text-xs text-gray-600 font-bold">Rank</p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-4 border-white/50 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-black text-[#0A4A7C] mb-1">{userStats.missionsCompleted}</p>
              <p className="text-xs text-gray-600 font-bold">Missions</p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-4 border-white/50 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Medal className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-black text-[#0A4A7C] mb-1">{userStats.badgesEarned}</p>
              <p className="text-xs text-gray-600 font-bold">Badges</p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-8 max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-6 border-4 border-white/50 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#C15BFF] to-[#0A98FF] rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-black text-white">{userStats.level}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-500">Level {userStats.level}</p>
                  <p className="text-xs text-gray-400">{userStats.currentXP} / {userStats.levelXP} XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Next Level</p>
                <p className="text-lg font-black text-[#C15BFF]">{userStats.level + 1}</p>
              </div>
            </div>

            <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#C15BFF] via-[#0A98FF] to-[#00FFF0] rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${(userStats.currentXP / userStats.levelXP) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right font-semibold">
              {Math.round((userStats.currentXP / userStats.levelXP) * 100)}% to level up
            </p>
          </div>
        </div>
      </section>

      {/* SEASONAL CAMPAIGN SECTION */}
      {currentCampaign.isActive && (
        <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-[#FFBC57] via-[#FF9500] to-[#F97316]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,188,87,0.3),transparent_50%)] animate-pulse" />

          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-20 w-64 h-64 bg-[#C15BFF] rounded-full blur-3xl opacity-20 animate-float" />
            <div className="absolute bottom-10 left-20 w-80 h-80 bg-[#00FFF0] rounded-full blur-3xl opacity-15 animate-float-delayed" />
          </div>

          {/* Floating icons */}
          <div className="absolute top-20 right-8 md:right-20 animate-bounce">
            <div className="w-14 h-14 bg-gradient-to-br from-[#EC4899] to-[#DB2777] rounded-2xl flex items-center justify-center shadow-2xl rotate-12 backdrop-blur-sm border-2 border-white/30">
              <Gift className="w-7 h-7 text-white drop-shadow-lg" />
            </div>
          </div>

          <div className="absolute bottom-24 left-8 md:left-16 animate-pulse" style={{ animationDelay: '0.4s' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-[#A855F7] to-[#9333EA] rounded-xl flex items-center justify-center shadow-xl -rotate-12 backdrop-blur-sm border-2 border-white/30">
              <Calendar className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border-4 border-white/50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white px-4 py-1.5 rounded-full text-xs font-bold mb-3 shadow-md">
                    🎉 CAMPAIGN AKTIF
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-[#0A4A7C] mb-2">
                    {currentCampaign.emoji} {currentCampaign.name}
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {currentCampaign.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-xl border-2 border-gray-200">
                      <p className="text-xs text-gray-500 font-bold">Reward</p>
                      <p className="text-sm font-black text-[#0A4A7C]">{currentCampaign.reward}</p>
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-xl border-2 border-gray-200">
                      <p className="text-xs text-gray-500 font-bold">Participants</p>
                      <p className="text-sm font-black text-[#0A4A7C]">{currentCampaign.participants.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-[#EC4899] to-[#DB2777] rounded-3xl p-6 shadow-2xl border-4 border-white/50 mb-4">
                    <p className="text-xs text-white/80 font-bold mb-2">Time Left</p>
                    <div className="flex gap-2 justify-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
                        <p className="text-3xl font-black text-white">{timeRemaining.days}</p>
                        <p className="text-xs text-white/80 font-semibold">Days</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2">
                        <p className="text-3xl font-black text-white">{timeRemaining.hours}</p>
                        <p className="text-xs text-white/80 font-semibold">Hrs</p>
                      </div>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-[#0A4A7C] to-[#0A98FF] text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 mx-auto">
                    Join Campaign
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STREAK SYSTEM SECTION */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-[#F97316] via-[#DC2626] to-[#991B1B]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(249,115,22,0.3),transparent_50%)] animate-pulse" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-20 w-64 h-64 bg-[#FBFF2B] rounded-full blur-3xl opacity-20 animate-float" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#FF9500] rounded-full blur-3xl opacity-15 animate-float-delayed" />
        </div>

        {/* Floating fire icons */}
        <div className="absolute top-24 right-12 md:right-24 animate-bounce">
          <div className="text-6xl drop-shadow-2xl animate-pulse">🔥</div>
        </div>
        <div className="absolute top-40 left-12 md:left-24 animate-bounce" style={{ animationDelay: '0.3s' }}>
          <div className="text-5xl drop-shadow-2xl animate-pulse">🔥</div>
        </div>
        <div className="absolute bottom-32 right-20 md:right-32 animate-bounce" style={{ animationDelay: '0.6s' }}>
          <div className="text-5xl drop-shadow-2xl animate-pulse">🔥</div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-block bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold mb-4 border-2 border-white/30 shadow-lg">
              🔥 STREAK SYSTEM
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 drop-shadow-lg">
              Keep Your Streak Alive!
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Login dan nabung setiap hari untuk maintain streak dan unlock special rewards! 💪
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white/50">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#F97316] to-[#DC2626] rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl">
                      {streakData.currentStreak >= 30 ? "🔥🔥🔥" : streakData.currentStreak >= 7 ? "🔥🔥" : streakData.currentStreak >= 1 ? "🔥" : "💨"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 mb-1">CURRENT STREAK</p>
                    <p className="text-5xl font-black text-[#0A4A7C]">{streakData.currentStreak}</p>
                    <p className="text-sm text-gray-500 font-semibold">days in a row</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                  <p className="text-xs text-gray-500 font-bold mb-2">LONGEST STREAK</p>
                  <p className="text-3xl font-black text-gray-400">🏆 {streakData.longestStreak} days</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-500 mb-4">STREAK MILESTONES</p>
                <div className="space-y-3">
                  <div className={`p-3 rounded-xl border-2 ${streakData.currentStreak >= 7 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{streakData.currentStreak >= 7 ? '✅' : '🔒'}</span>
                        <div>
                          <p className="font-bold text-gray-700">7 Days Streak</p>
                          <p className="text-xs text-gray-500">+100 XP Bonus</p>
                        </div>
                      </div>
                      <span className="text-xl">🔥🔥</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border-2 ${streakData.currentStreak >= 30 ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{streakData.currentStreak >= 30 ? '✅' : '🔒'}</span>
                        <div>
                          <p className="font-bold text-gray-700">30 Days Streak</p>
                          <p className="text-xs text-gray-500">Diamond Hands Badge</p>
                        </div>
                      </div>
                      <span className="text-xl">🔥🔥🔥</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border-2 bg-gray-50 border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🔒</span>
                        <div>
                          <p className="font-bold text-gray-700">100 Days Streak</p>
                          <p className="text-xs text-gray-500">Legend Status</p>
                        </div>
                      </div>
                      <span className="text-xl">🔥🔥🔥🔥🔥</span>
                    </div>
                  </div>
                </div>

                {streakData.currentStreak >= 7 && (
                  <button className="mt-4 w-full bg-gradient-to-r from-[#EC4899] to-[#DB2777] text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                    Share Streak Card
                    <Sparkles className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BADGES GALLERY SECTION */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-[#00FFF0] via-[#0A98FF] to-[#04877f]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(0,255,240,0.3),transparent_50%)] animate-pulse" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-20 w-64 h-64 bg-[#C15BFF] rounded-full blur-3xl opacity-20 animate-float" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-[#FBFF2B] rounded-full blur-3xl opacity-15 animate-float-delayed" />
        </div>

        {/* Floating icons */}
        <div className="absolute top-20 right-8 md:right-20 animate-bounce">
          <div className="w-14 h-14 bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-2xl flex items-center justify-center shadow-2xl rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Medal className="w-7 h-7 text-white drop-shadow-lg" />
          </div>
        </div>

        <div className="absolute bottom-24 left-8 md:left-16 animate-pulse" style={{ animationDelay: '0.5s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#A855F7] to-[#9333EA] rounded-xl flex items-center justify-center shadow-xl -rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Crown className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-block bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold mb-4 border-2 border-white/30 shadow-lg">
              🏆 ACHIEVEMENT BADGES
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 drop-shadow-lg">
              Collect & Flex Your Badges
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Unlock exclusive badges by completing missions and reaching milestones! 🎖️
            </p>
          </div>

          {/* Horizontal scrolling badges */}
          <div className="overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <div className="flex gap-4 w-max min-w-full">
              {badges.map((badge, index) => (
                <div key={index} className="w-[200px] flex-shrink-0">
                  <div className={`relative p-6 rounded-2xl border-4 transition-all ${badge.unlocked
                      ? 'bg-white/95 backdrop-blur-sm border-white/50 shadow-2xl hover:-translate-y-2 hover:shadow-3xl cursor-pointer'
                      : 'bg-gray-800/90 backdrop-blur-sm border-gray-700/50 opacity-60 grayscale'
                    }`}>
                    {/* Icon */}
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-4xl shadow-lg ${badge.unlocked
                        ? badge.category === 'trading' ? 'bg-gradient-to-br from-[#0A98FF] to-[#04877f]' :
                          badge.category === 'social' ? 'bg-gradient-to-br from-[#FFBC57] to-[#FF9500]' :
                            badge.category === 'streak' ? 'bg-gradient-to-br from-[#F97316] to-[#DC2626]' :
                              'bg-gradient-to-br from-[#C15BFF] to-[#9333EA]'
                        : 'bg-gray-700'
                      }`}>
                      {badge.unlocked ? badge.icon : '🔒'}
                    </div>

                    {/* Title */}
                    <h3 className={`text-center font-black text-sm mb-2 ${badge.unlocked ? 'text-[#0A4A7C]' : 'text-gray-400'
                      }`}>
                      {badge.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-center text-xs mb-3 ${badge.unlocked ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                      {badge.description}
                    </p>

                    {/* Progress bar for in-progress badges */}
                    {!badge.unlocked && badge.progress && badge.maxProgress && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{badge.progress}/{badge.maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#00FFF0] to-[#0A98FF] rounded-full transition-all duration-500"
                            style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Unlock date */}
                    {badge.unlocked && badge.unlockedAt && (
                      <p className="text-center text-xs text-[#0A98FF] mt-3 font-semibold">
                        {new Date(badge.unlockedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    )}

                    {/* Lock overlay */}
                    {!badge.unlocked && !badge.progress && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                          <span className="text-2xl">🔒</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/profile" className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#0A4A7C] px-6 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all border-4 border-white/50">
              View All Badges
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* MISSIONS SECTION */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-[#0A4A7C] via-[#0A98FF] to-[#04877f]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,152,255,0.3),transparent_50%)] animate-pulse" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#C15BFF] rounded-full blur-3xl opacity-30 animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FBFF2B] rounded-full blur-3xl opacity-20 animate-float-delayed" />
        </div>

        {/* Floating icons */}
        <div className="absolute top-24 right-8 md:right-20 animate-bounce">
          <div className="w-14 h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center shadow-2xl rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Target className="w-7 h-7 text-white drop-shadow-lg" />
          </div>
        </div>

        <div className="absolute bottom-32 left-8 md:left-20 animate-pulse" style={{ animationDelay: '0.6s' }}>
          <div className="w-12 h-12 bg-gradient-to-br from-[#FFBC57] to-[#FF9500] rounded-xl flex items-center justify-center shadow-xl -rotate-12 backdrop-blur-sm border-2 border-white/30">
            <Rocket className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-block bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold mb-4 border-2 border-white/30 shadow-lg">
              ⚡ DAILY MISSIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 drop-shadow-lg">
              Complete Missions, Earn XP!
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Selesaikan misi harian dan weekly untuk level up lebih cepat! 🚀
            </p>
          </div>

          {isLoading ? (
            <div className="text-white text-center text-xl font-bold animate-pulse py-12">
              Loading missions...
            </div>
          ) : (
            <div className="space-y-8">
              {/* Daily Missions */}
              {dailyMissions.length > 0 && (
                <div>
                  <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-br from-[#FFBC57] to-[#FF9500] rounded-lg flex items-center justify-center text-sm">
                      ⚡
                    </span>
                    Daily Missions
                  </h3>
                  <div className="space-y-3">
                    {dailyMissions.map((mission) => (
                      <MissionCard key={mission.id} mission={mission} onComplete={handleComplete} />
                    ))}
                  </div>
                </div>
              )}

              {/* Weekly Missions */}
              {weeklyMissions.length > 0 && (
                <div>
                  <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-br from-[#C15BFF] to-[#9333EA] rounded-lg flex items-center justify-center text-sm">
                      📅
                    </span>
                    Weekly Missions
                  </h3>
                  <div className="space-y-3">
                    {weeklyMissions.map((mission) => (
                      <MissionCard key={mission.id} mission={mission} onComplete={handleComplete} />
                    ))}
                  </div>
                </div>
              )}

              {/* Special Missions */}
              {specialMissions.length > 0 && (
                <div>
                  <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] rounded-lg flex items-center justify-center text-sm">
                      ⭐
                    </span>
                    Special Missions
                  </h3>
                  <div className="space-y-3">
                    {specialMissions.map((mission) => (
                      <MissionCard key={mission.id} mission={mission} onComplete={handleComplete} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* LEADERBOARD PREVIEW SECTION */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#1E3A8A]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(139,92,246,0.3),transparent_50%)] animate-pulse" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-20 w-64 h-64 bg-[#FBBF24] rounded-full blur-3xl opacity-20 animate-float" />
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#C15BFF] rounded-full blur-3xl opacity-15 animate-float-delayed" />
        </div>

        {/* Trophy icon */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="text-6xl drop-shadow-2xl">🏆</div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-block bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold mb-4 border-2 border-white/30 shadow-lg">
              👑 LEADERBOARD
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 drop-shadow-lg">
              Top Players This Month
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Compete dengan user lain dan raih posisi teratas! 🥇
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white/50 mb-6">
            <div className="space-y-3">
              {leaderboardPreview.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${entry.rank <= 3
                      ? 'bg-gradient-to-r from-[#FBBF24]/10 to-transparent border-[#FBBF24]/30 shadow-lg'
                      : 'bg-gray-50 border-gray-200'
                    } ${entry.username === 'You' ? 'ring-4 ring-[#C15BFF] ring-offset-2' : ''}`}
                >
                  {/* Rank */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl flex-shrink-0 ${entry.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg' :
                      entry.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900 shadow-lg' :
                        entry.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg' :
                          'bg-gray-200 text-gray-700'
                    }`}>
                    {entry.rank <= 3 ? (entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉') : entry.rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C15BFF] to-[#0A98FF] flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg">
                    {entry.username[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#0A4A7C] truncate text-lg">
                      {entry.username}
                      {entry.username === 'You' && (
                        <span className="ml-2 text-xs font-bold text-[#C15BFF]">(You)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 font-semibold">Level {entry.level}</p>
                  </div>

                  {/* XP */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-[#0A98FF] text-xl">
                      {entry.xp.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 font-semibold">XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/leaderboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all border-4 border-white/30">
              View Full Leaderboard
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <ChatBot />
    </>
  );
}

// Mission Card Component
function MissionCard({ mission, onComplete }: { mission: Mission; onComplete: (id: number) => void }) {
  return (
    <div
      className={`group bg-white/95 backdrop-blur-sm border-4 border-white/50 rounded-3xl p-6 transition-all duration-300 shadow-xl ${mission.isCompleted
          ? 'opacity-80 scale-95 grayscale'
          : 'hover:scale-[1.01] hover:-translate-y-1 hover:shadow-2xl'
        }`}
    >
      <div className="flex items-start gap-5">
        <button
          onClick={() => !mission.isCompleted && onComplete(mission.id)}
          className={`mt-1 flex-shrink-0 transition-all duration-300 transform ${mission.isCompleted
              ? 'text-green-500 scale-110'
              : 'text-gray-300 hover:text-[#00FFF0] hover:scale-110'
            }`}
        >
          {mission.isCompleted ? (
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
          ) : (
            <Circle className="w-10 h-10" />
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2 gap-4">
            <h3 className={`text-xl font-black ${mission.isCompleted ? 'text-gray-400 line-through' : 'text-[#0A4A7C]'}`}>
              {mission.title}
            </h3>
            <span className="px-3 py-1.5 bg-gradient-to-r from-[#C15BFF] to-[#0A98FF] text-white text-sm font-bold rounded-full shadow-md flex items-center gap-1.5 flex-shrink-0">
              <Award className="w-4 h-4" />
              +{mission.xp} XP
            </span>
          </div>

          <p className="text-gray-600 mb-4 leading-relaxed font-medium">{mission.description}</p>

          <div className="flex items-center gap-3">
            <span className="inline-block text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider">
              {mission.category}
            </span>

            {mission.progress !== undefined && mission.maxProgress && (
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold">Progress</span>
                  <span className="font-bold">{mission.progress}/{mission.maxProgress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0A98FF] to-[#00FFF0] rounded-full transition-all duration-500"
                    style={{ width: `${(mission.progress / mission.maxProgress) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
