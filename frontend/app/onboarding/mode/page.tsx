'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, User, Users, CheckCircle2, Sparkles, Trophy, Zap, Target } from 'lucide-react';

export default function ChooseModePage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem('userSession');
    const profilingData = localStorage.getItem('userProfiling');
    const userData = localStorage.getItem('userData');

    if (!sessionStr && !userData) {
      router.push('/onboarding');
      return;
    }

    if (!profilingData) {
      router.push('/onboarding/profiling');
    }
  }, [router]);

  const handleSelectMode = (mode: string) => {
    setSelectedMode(mode);
  };

  const handleContinue = () => {
    if (!selectedMode) return;
    router.push('/onboarding/success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A4A7C] via-[#0A98FF] to-[#04877f] overflow-hidden relative">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,152,255,0.3),transparent_50%)] animate-pulse" />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#C15BFF] rounded-full blur-3xl opacity-30 animate-float" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#FBFF2B] rounded-full blur-3xl opacity-20 animate-float-delayed" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-[#00FFF0] rounded-full blur-3xl opacity-25 animate-float-slow" />
      </div>

      {/* Floating decorative icons */}
      <div className="absolute top-24 left-8 animate-bounce" style={{ animationDelay: '0.2s' }}>
        <div className="w-12 h-12 bg-gradient-to-br from-[#FBFF2B] to-[#FFBC57] rounded-xl flex items-center justify-center shadow-xl rotate-12">
          <Trophy className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute top-32 right-12 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <div className="w-10 h-10 bg-gradient-to-br from-[#C15BFF] to-[#9333EA] rounded-lg flex items-center justify-center shadow-xl -rotate-12">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 py-16">
        {/* Back Button */}
        <div className="absolute top-6 left-4">
          <button
            onClick={() => router.back()}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-white/30 transition-all border border-white/30"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8 max-w-lg">
          <div className="inline-block bg-gradient-to-r from-[#FBFF2B] to-[#FFBC57] text-[#0A4A7C] px-4 py-1.5 rounded-full text-xs font-black mb-4 shadow-lg">
            🎯 LANGKAH TERAKHIR
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg">
            Pilih Mode Kamu!
          </h1>
          <p className="text-sm md:text-base text-white/90 font-medium">
            Nabung sendiri atau ajak teman buat seru-seruan 🚀
          </p>
        </div>

        {/* Mode Cards */}
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 px-2">
          {/* Solo Mode */}
          <button
            onClick={() => handleSelectMode('solo')}
            className={`relative p-5 md:p-6 rounded-2xl md:rounded-3xl text-left transition-all duration-300 ${selectedMode === 'solo'
                ? 'bg-white shadow-2xl scale-[1.02] border-4 border-[#0A98FF]'
                : 'bg-white/95 backdrop-blur-sm border-4 border-white/50 hover:scale-[1.01] hover:shadow-xl'
              }`}
          >
            {/* Selection indicator */}
            {selectedMode === 'solo' && (
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[#0A98FF] to-[#00FFF0] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            )}

            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#0A98FF] to-[#0A4A7C] rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <User className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-[#0A4A7C] mb-1">Nabung Solo</h3>
                <p className="text-sm text-gray-600 font-medium">Investasi mandiri, kontrol penuh 💪</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { icon: Target, text: 'Kontrol penuh atas strategi' },
                { icon: Zap, text: 'Withdraw kapan saja' },
                { icon: Sparkles, text: 'Cocok untuk yang mandiri' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 bg-[#0A98FF]/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-3.5 h-3.5 text-[#0A98FF]" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </button>

          {/* Group Mode */}
          <button
            onClick={() => handleSelectMode('group')}
            className={`relative p-5 md:p-6 rounded-2xl md:rounded-3xl text-left transition-all duration-300 ${selectedMode === 'group'
                ? 'bg-white shadow-2xl scale-[1.02] border-4 border-[#C15BFF]'
                : 'bg-white/95 backdrop-blur-sm border-4 border-white/50 hover:scale-[1.01] hover:shadow-xl'
              }`}
          >
            {/* Popular Badge */}
            <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-[#C15BFF] to-[#FF6B9D] text-white text-xs font-black rounded-full shadow-lg animate-pulse">
              🔥 POPULER
            </div>

            {/* Selection indicator */}
            {selectedMode === 'group' && (
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[#C15BFF] to-[#FF6B9D] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            )}

            <div className="flex items-start gap-4 mb-4 mt-2">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#C15BFF] to-[#9333EA] rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Users className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-[#0A4A7C] mb-1">Nabung Bareng</h3>
                <p className="text-sm text-gray-600 font-medium">Ajak teman, lebih seru! 🎉</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { icon: Users, text: 'Ajak teman ke vault' },
                { icon: Trophy, text: 'Kompetisi & leaderboard' },
                { icon: Sparkles, text: 'Bonus XP setiap invite' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 bg-[#C15BFF]/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-3.5 h-3.5 text-[#C15BFF]" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedMode}
          className={`w-full max-w-md py-4 rounded-2xl font-black text-lg transition-all ${selectedMode
              ? 'bg-gradient-to-r from-[#0A98FF] to-[#C15BFF] text-white shadow-[0_6px_0_0_rgba(10,74,124,1)] hover:shadow-[0_4px_0_0_rgba(10,74,124,1)] hover:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(10,74,124,1)] active:translate-y-1'
              : 'bg-white/30 text-white/60 cursor-not-allowed'
            }`}
        >
          {selectedMode ? (
            <span className="flex items-center justify-center gap-2">
              Lanjutkan
              <Sparkles className="w-5 h-5" />
            </span>
          ) : (
            'Pilih Mode Dulu Ya!'
          )}
        </button>

        {/* Helper text */}
        <p className="text-white/60 text-xs mt-4 text-center max-w-md">
          Kamu bisa ganti mode kapan saja dari halaman Settings 🔧
        </p>
      </div>
    </div>
  );
}
