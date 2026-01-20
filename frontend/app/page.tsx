'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useState, useEffect } from 'react';

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
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
              <span className="text-blue-400 text-body">Platform Investasi DeFi Indonesia</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-indigo bg-clip-text text-transparent">
              KITA
            </h1>
            <p className="text-subheading text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Kolektif Investasi Tanpa Ambyar! Nabung sendiri atau bareng temen, sambil main strategi DeFi yang seru.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/onboarding"
                className="text-button px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-200 transform hover:scale-105"
              >
                Mulai Sekarang
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <span className="text-slate-400 text-body">Total Dana Terkunci</span>
              </div>
              <div className="text-heading text-white mb-1">$2.4M+</div>
              <div className="text-body text-green-400">+12% dari minggu lalu</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <span className="text-slate-400 text-body">Rata-rata APY</span>
              </div>
              <div className="text-heading text-white mb-1">18.5%</div>
              <div className="text-body text-slate-400">Dari posisi aktif</div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <span className="text-slate-400 text-body">Pengguna Aktif</span>
              </div>
              <div className="text-heading text-white mb-1">1,250+</div>
              <div className="text-body text-slate-400">Bertambah setiap hari</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-heading text-white mb-4">Cara Kerja KITA</h2>
              <p className="text-subheading text-slate-400">Mulai investasi dengan mudah, cuan dengan strategi DeFi</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl mb-6">
                  💰
                </div>
                <div className="mb-2 text-blue-400 text-body uppercase tracking-wider">Langkah 1</div>
                <h3 className="text-subheading text-white mb-3">Pilih Mode Nabung</h3>
                <p className="text-body text-slate-400 leading-relaxed">
                  Nabung sendiri atau ajak teman nabung bareng. Pilih strategi yang kamu mau: cash secured put, covered call, dan lainnya!
                </p>
              </div>

              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-2xl mb-6">
                  🎯
                </div>
                <div className="mb-2 text-purple-400 text-body uppercase tracking-wider">Langkah 2</div>
                <h3 className="text-subheading text-white mb-3">Atur Target & Deposit</h3>
                <p className="text-body text-slate-400 leading-relaxed">
                  Tentukan target harga dan strategi DeFi yang sesuai. Deposit IDRX stablecoin kamu dan mulai dapat cuan.
                </p>
              </div>

              <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-2xl mb-6">
                  ⚡
                </div>
                <div className="mb-2 text-green-400 text-body uppercase tracking-wider">Langkah 3</div>
                <h3 className="text-subheading text-white mb-3">Raih Cuan & XP</h3>
                <p className="text-body text-slate-400 leading-relaxed">
                  Dapat cashback instant, kumpulin XP dari misi, ajak teman, dan level up untuk unlock badge eksklusif!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-700/50">
              <h2 className="text-heading text-white mb-12 text-center">Kenapa Pilih KITA?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">1</span>
                  </div>
                  <div>
                    <h3 className="text-subheading text-white mb-2">Nabung Sendiri atau Bareng</h3>
                    <p className="text-body text-slate-400">
                      Fleksibel! Kamu bisa nabung solo atau ajak teman untuk nabung bareng dalam satu vault.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">2</span>
                  </div>
                  <div>
                    <h3 className="text-subheading text-white mb-2">Banyak Strategi DeFi</h3>
                    <p className="text-body text-slate-400">
                      Cash secured put, covered call vault, tebak naik, buy put, dan long put - pilih sesuai gaya investasi kamu.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">3</span>
                  </div>
                  <div>
                    <h3 className="text-subheading text-white mb-2">Gamifikasi Seru</h3>
                    <p className="text-body text-slate-400">
                      Kumpulin XP dari misi harian, invite teman, dan streak. Raih 500 XP untuk level up dan unlock badge eksklusif!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">4</span>
                  </div>
                  <div>
                    <h3 className="text-subheading text-white mb-2">Cepat & Murah</h3>
                    <p className="text-body text-slate-400">
                      Dibangun di Base Network dengan biaya transaksi rendah dan kecepatan tinggi.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">5</span>
                  </div>
                  <div>
                    <h3 className="text-subheading text-white mb-2">Reward & Achievement</h3>
                    <p className="text-body text-slate-400">
                      Selesaikan misi seperti buat 3 posisi, maintain streak, dan ajak teman. Makin aktif, makin banyak benefit!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">6</span>
                  </div>
                  <div>
                    <h3 className="text-subheading text-white mb-2">Aman & Transparan</h3>
                    <p className="text-body text-slate-400">
                      Smart contract yang sudah diaudit, on-chain transparency, dan keamanan tingkat institutional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl hover:shadow-blue-500/25 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-body text-slate-400">© 2026 KITA. Built on Base Network.</p>
        </div>
      </footer>
    </>
  );
}
