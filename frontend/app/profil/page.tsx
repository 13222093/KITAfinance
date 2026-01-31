'use client';

import { Navbar } from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatBot } from '@/components/ChatBot';
import { Award, TrendingUp, Zap, Target, Calendar, Mail, Phone, Edit2, LogOut, HelpCircle, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Mock gamification data (synchronized with dashboard and missions)
  const gamificationData = {
    level: 8,
    currentXP: 2450,
    levelXP: 3000,
    totalXP: 12450,
    streak: 7,
    totalTrades: 12,
    achievements: 5,
    totalAchievements: 15,
  };

  useEffect(() => {
    const localData = localStorage.getItem('userData');
    const sessionData = localStorage.getItem('userSession');

    if (localData) {
      const user = JSON.parse(localData);
      setUserData(user);
      setEditedName(user.fullName);
      setProfilePhoto(user.profilePhoto || null);
    } else if (sessionData) {
      const session = JSON.parse(sessionData);
      // Map session to profile data structure
      const mappedUser = {
        fullName: session.name || 'User',
        username: session.name ? session.name.replace(/\s+/g, '').toLowerCase() : 'user',
        email: 'user@kita.finance', // Placeholder
        phoneNumber: `${session.countryCode}${session.phoneNumber}`,
        createdAt: new Date().toISOString(), // Fallback
        profilePhoto: null
      };
      setUserData(mappedUser);
      setEditedName(mappedUser.fullName);
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = () => {
    if (userData) {
      const updatedUser = { ...userData, fullName: editedName, profilePhoto };
      setUserData(updatedUser);
      // If we are in session mode, we might want to update session or just local state for now
      // For this MVP, let's update userData in localStorage if it exists, or just state
      if (localStorage.getItem('userData')) {
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userData.fullName);
    setProfilePhoto(userData.profilePhoto || null);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userSession');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('userProfiling');
    setShowLogoutModal(false);
    router.push('/');
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#0A4A7C] via-[#0A98FF] to-[#04877f] pt-24 px-4 flex items-center justify-center">
          <div className="text-white text-xl animate-pulse drop-shadow-lg">Loading Profile...</div>
        </div>
      </>
    );
  }

  if (!userData) {
    return null;
  }

  const xpProgress = (gamificationData.currentXP / gamificationData.levelXP) * 100;

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

        <div className="relative z-10 max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <div className="mb-4">
            <div className="inline-block bg-gradient-to-r from-[#C15BFF] to-[#0A98FF] text-white px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-lg">
              👤 PROFILE
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg mb-1">Profil Trader 🚀</h1>
            <p className="text-sm md:text-base text-white/80">Kelola profil dan lihat progress kamu</p>
          </div>

          {/* HERO CARD - Player Profile (Solid Gradient) */}
          <div className="bg-gradient-to-br from-[#FFBC57] via-[#FF9500] to-[#F97316] rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-white/30 relative overflow-hidden">
            {/* Animated orb */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-2xl" />

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Photo & Level Badge */}
              <div className="relative group flex-shrink-0">
                {/* Level Badge Ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FBFF2B] to-[#00FFF0] rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />

                <div className="relative">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                    />
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                      <span className="text-5xl md:text-6xl">👤</span>
                    </div>
                  )}

                  {/* Level Badge */}
                  <div className="absolute -bottom-2 -right-2 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                    <div className="text-center">
                      <div className="text-xs font-bold text-white/80">LVL</div>
                      <div className="text-xl md:text-2xl font-black text-white">{gamificationData.level}</div>
                    </div>
                  </div>

                  {isEditing && (
                    <>
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <button
                        onClick={() => document.getElementById('photo-upload')?.click()}
                        className="absolute top-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg border-2 border-orange-200"
                      >
                        <span className="text-lg">📷</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* User Info & XP */}
              <div className="flex-1 text-center md:text-left min-w-0">
                {!isEditing ? (
                  <>
                    <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg mb-1 truncate">
                      {userData.fullName}
                    </h2>
                    <p className="text-base md:text-lg text-white/90 font-bold mb-4">@{userData.username}</p>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-xl px-4 py-2 text-white font-bold text-lg md:text-xl mb-2 focus:outline-none focus:border-white focus:bg-white/30 transition-all placeholder:text-white/60"
                      placeholder="Nama Lengkap"
                    />
                    <p className="text-white/80 font-medium mb-4">@{userData.username}</p>
                  </>
                )}

                {/* XP Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs md:text-sm text-white mb-1.5">
                    <span className="font-bold">XP Progress</span>
                    <span className="font-bold">{gamificationData.currentXP} / {gamificationData.levelXP} XP</span>
                  </div>
                  <div className="relative h-3 md:h-4 bg-white/20 rounded-full overflow-hidden border-2 border-white/30 shadow-inner">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00FFF0] to-[#0A98FF] rounded-full transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>

                {/* Streak Badge */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border-2 border-white/30">
                  <span className="text-lg">🔥</span>
                  <span className="text-xs md:text-sm font-black text-white">{gamificationData.streak} Day Streak!</span>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute top-4 right-4 md:static w-10 h-10 md:w-auto md:h-auto bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 rounded-xl md:px-4 md:py-2 flex items-center justify-center md:gap-2 transition-all group flex-shrink-0"
                >
                  <Edit2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  <span className="hidden md:inline text-sm font-bold text-white">Edit</span>
                </button>
              ) : (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/30 transition-all border-2 border-white/30 text-sm"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-white text-orange-600 rounded-xl font-bold hover:scale-105 transition-all shadow-lg text-sm"
                  >
                    Simpan
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* GAMIFICATION STATS - Horizontal Scroll */}
          <div className="overflow-hidden -mx-4 md:mx-0">
            <div className="flex gap-3 md:gap-4 px-4 md:px-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 md:grid md:grid-cols-4 md:overflow-visible">
              {/* Total XP */}
              <div className="min-w-[160px] md:min-w-0 flex-shrink-0 snap-start bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] rounded-2xl p-4 md:p-5 shadow-xl border-2 border-white/30 hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-white/80 mb-1 font-semibold">Total XP</p>
                <p className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">{gamificationData.totalXP}</p>
              </div>

              {/* Achievements */}
              <Link href="/missions" className="min-w-[160px] md:min-w-0 flex-shrink-0 snap-start block bg-gradient-to-br from-[#FBFF2B] to-[#FFBC57] rounded-2xl p-4 md:p-5 shadow-xl border-2 border-white/30 hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mb-3">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-white/80 mb-1 font-semibold">Achievements</p>
                <p className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">
                  {gamificationData.achievements}/{gamificationData.totalAchievements}
                </p>
              </Link>

              {/* Total Trades */}
              <div className="min-w-[160px] md:min-w-0 flex-shrink-0 snap-start bg-gradient-to-br from-[#C15BFF] to-[#A855F7] rounded-2xl p-4 md:p-5 shadow-xl border-2 border-white/30 hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-xs text-white/80 mb-1 font-semibold">Total Trades</p>
                <p className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">{gamificationData.totalTrades}</p>
              </div>

              {/* Streak */}
              <div className="min-w-[160px] md:min-w-0 flex-shrink-0 snap-start bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-4 md:p-5 shadow-xl border-2 border-white/30 hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg mb-3">
                  <span className="text-2xl">🔥</span>
                </div>
                <p className="text-xs text-white/80 mb-1 font-semibold">Best Streak</p>
                <p className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">{gamificationData.streak} days</p>
              </div>
            </div>
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Account Details - Glassmorphic */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-white/20">
                <h3 className="text-xl md:text-2xl font-black text-white drop-shadow-lg mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  Informasi Akun
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-white/70" />
                      <span className="text-sm md:text-base text-white/80 font-semibold">Email</span>
                    </div>
                    <span className="text-sm md:text-base text-white font-bold truncate ml-2">{userData.email}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-white/70" />
                      <span className="text-sm md:text-base text-white/80 font-semibold">Phone</span>
                    </div>
                    <span className="text-sm md:text-base text-white font-bold">{userData.phoneNumber || '+62 812 3456 7890'}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-white/70" />
                      <span className="text-sm md:text-base text-white/80 font-semibold">Joined</span>
                    </div>
                    <span className="text-sm md:text-base text-white font-bold">
                      {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      }) : 'Jan 2026'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-white/20">
                <h3 className="text-xl md:text-2xl font-black text-white drop-shadow-lg mb-6">Quick Actions</h3>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center justify-between p-4 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-xl border-2 border-red-400/40 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500/30 rounded-xl flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-red-300" />
                      </div>
                      <span className="text-base md:text-lg font-bold text-red-200">Logout</span>
                    </div>
                    <span className="text-red-300 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Investment Stats - Solid Gradient */}
              <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-2xl border-2 border-white/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                <h3 className="text-lg font-bold mb-6 opacity-90 border-b border-white/20 pb-4 relative z-10">Portfolio Stats</h3>

                <div className="space-y-5 relative z-10">
                  <div>
                    <p className="text-sm text-white/80 mb-1">Total Balance</p>
                    <p className="text-3xl md:text-4xl font-black drop-shadow-lg">Rp 12.5jt</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/80 mb-1">Total Return</p>
                    <p className="text-2xl md:text-3xl font-black text-[#FBFF2B] drop-shadow-lg">+12.5%</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/80 mb-1">Active Vaults</p>
                    <p className="text-2xl md:text-3xl font-black drop-shadow-lg">3</p>
                  </div>
                </div>
              </div>

              {/* Help Card - Glassmorphic */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-white/20 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0A98FF] to-[#04877f] rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-black text-white drop-shadow-lg mb-2">Need Help?</h3>
                <p className="text-sm md:text-base text-white/80 font-medium mb-6">Tim support siap bantu 24/7</p>
                <button className="w-full bg-gradient-to-r from-[#00FFF0] to-[#0A98FF] text-white font-bold py-3 md:py-4 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all active:scale-95">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-[#0A4A7C]/80 backdrop-blur-lg flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-white/50 animate-pop">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg">
                <span className="text-4xl">👋</span>
              </div>
              <h3 className="text-2xl font-black text-[#0A4A7C] mb-3">Logout Confirmation</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                You'll be logged out. Your data is saved and you can login anytime.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
      <ChatBot />
    </>
  );
}
