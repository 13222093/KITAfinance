'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ChooseModePage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  useEffect(() => { // Make sure user datang dari halaman ai profiling
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 mb-6 flex items-center"
        >
          <span className="text-xl mr-2">←</span> Kembali
        </button>

        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mb-4 border border-blue-500/30">
            <span className="text-blue-600 text-body">Langkah Terakhir</span>
          </div>
          <h1 className="text-heading text-gray-800 mb-3">
            Pilih Mode Investasi Kamu
          </h1>
          <p className="text-subheading text-gray-600">
            Nabung sendiri atau ajak teman untuk nabung bareng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Solo Mode */}
          <button
            onClick={() => handleSelectMode('solo')}
            className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left ${selectedMode === 'solo'
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
          >
            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl mb-4">
                👤
              </div>
              <h3 className="text-subheading text-gray-800 mb-2">Nabung Solo</h3>
              <p className="text-body text-gray-600 mb-4">Investasi mandiri dengan kontrol penuh</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-cyan-500 mt-1">✓</span>
                <span className="text-body text-gray-700">Kontrol penuh atas investasi kamu</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-500 mt-1">✓</span>
                <span className="text-body text-gray-700">Fleksibel atur strategi sendiri</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-500 mt-1">✓</span>
                <span className="text-body text-gray-700">Withdraw kapan saja</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-500 mt-1">✓</span>
                <span className="text-body text-gray-700">Cocok untuk investor mandiri</span>
              </div>
            </div>

            {selectedMode === 'solo' && (
              <div className="mt-6 pt-6 border-t border-blue-200">
                <div className="flex items-center justify-center gap-2 text-blue-600 text-button">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Dipilih
                </div>
              </div>
            )}
          </button>

          {/* Group Mode */}
          <button
            onClick={() => handleSelectMode('group')}
            className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${selectedMode === 'group'
                ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
              }`}
          >
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                POPULAR
              </span>
            </div>

            <div className="mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-3xl mb-4">
                👥
              </div>
              <h3 className="text-subheading text-gray-800 mb-2">Nabung Bareng</h3>
              <p className="text-body text-gray-600 mb-4">Investasi bersama teman & komunitas</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-cyan-500 mt-1">✓</span>
                <span className="text-body text-gray-700">Ajak teman untuk gabung vault</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-500 mt-1">✓</span>
                <span className="text-body text-gray-700">Bonus XP untuk setiap invite</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-500 mt-1">✓</span>
                <span className="text-body text-gray-700">Kompetisi & leaderboard</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-500 mt-1">✓</span>
                <span className="text-body text-gray-700">Lebih seru, lebih engaging!</span>
              </div>
            </div>

            {selectedMode === 'group' && (
              <div className="mt-6 pt-6 border-t border-purple-200">
                <div className="flex items-center justify-center gap-2 text-purple-600 text-button">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Dipilih
                </div>
              </div>
            )}
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedMode}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-button py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {selectedMode ? 'Lanjutkan' : 'Pilih Mode Terlebih Dahulu'}
        </button>
      </div>
    </div>
  );
}
