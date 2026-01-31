'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { XPBar } from '@/components/gamification/XPBar';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userXP, setUserXP] = useState({ currentXP: 0, levelXP: 100, level: 1 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const userSession = localStorage.getItem('userSession');
    setIsLoggedIn(!!userData || !!userSession);

    // TODO: Fetch real user XP data from API
    if (userData || userSession) {
      // Mock data for now
      setUserXP({
        currentXP: 350,
        levelXP: 500,
        level: 3
      });
    }
  }, []);

  // Note: Setelah login, jangan arahin ke landing page lagi, tapi ke dashboardnya user

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo - KITAfinance (PRESERVED) */}
          <Link
            href={isLoggedIn ? "/dashboard" : "/"}
            className="text-2xl font-black bg-gradient-to-r from-[#0A98FF] to-[#00FFF0] bg-clip-text text-transparent hover:scale-105 transition-transform">
            KITA<span className="font-serif italic font-light tracking-wide text-[#f59e1b] bg-clip-border">finance</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="text-gray-700 hover:text-[#0A98FF] transition-colors font-semibold text-sm"
            >
              Dashboard
            </Link>
            <Link
              href={isLoggedIn ? "/nabung-bareng" : "/login"}
              className="text-gray-700 hover:text-[#0A98FF] transition-colors font-semibold text-sm"
            >
              Nabung Bareng
            </Link>
            <Link
              href={isLoggedIn ? "/missions" : "/login"}
              className="text-gray-700 hover:text-[#0A98FF] transition-colors font-semibold text-sm"
            >
              Missions
            </Link>
            <Link
              href={isLoggedIn ? "/vaults" : "/login"}
              className="text-gray-700 hover:text-[#0A98FF] transition-colors font-semibold text-sm"
            >
              Portofolio
            </Link>
          </div>

          {/* Desktop Right Section (CTA only) */}
          <div className="flex items-center gap-4">

            {/* Guest Mode Button (Dev Only) */}
            {!isLoggedIn && (
              <button
                onClick={() => {
                  localStorage.setItem('userData', JSON.stringify({
                    fullName: 'Guest Designer',
                    username: 'guest',
                    email: 'guest@kita.finance'
                  }));
                  localStorage.setItem('userProfiling', 'true');
                  window.location.href = '/dashboard';
                }}
                className="hidden lg:block px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                Guest Mode 🕵️
              </button>
            )}

            {/* Profile/Login Button */}
            <Link
              href={isLoggedIn ? "/profil" : "/login"}
              className="px-4 py-2 bg-gradient-to-r from-[#FFBC57] to-[#FF9500] hover:from-[#FF9500] hover:to-[#FFBC57] text-white font-bold rounded-xl transition-all duration-200 
                         shadow-[0_4px_0_0_rgba(255,149,0,0.4)] hover:shadow-[0_6px_0_0_rgba(255,149,0,0.4)] hover:-translate-y-0.5 
                         active:translate-y-1 active:shadow-[0_2px_0_0_rgba(255,149,0,0.4)] text-sm md:text-base md:px-6 md:py-2.5"
            >
              {isLoggedIn ? 'Profil' : 'Masuk'}
            </Link>
          </div>

          {/* Mobile Menu Button - HIDDEN due to Bottom Nav */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-2">
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-[#0A4A7C] font-semibold hover:bg-gray-50 rounded-xl transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href={isLoggedIn ? "/nabung-bareng" : "/login"}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-[#0A4A7C] font-semibold hover:bg-gray-50 rounded-xl transition-colors"
              >
                Nabung Bareng
              </Link>
              <Link
                href={isLoggedIn ? "/missions" : "/login"}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-[#0A4A7C] font-semibold hover:bg-gray-50 rounded-xl transition-colors"
              >
                Missions
              </Link>

              <div className="pt-4 px-4">
                {/* Mobile CTA (PRESERVED STYLE) */}
                <Link
                  href={isLoggedIn ? "/profil" : "/login"}
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white font-bold rounded-xl
                             shadow-[0_4px_0_0_rgba(255,149,0,0.4)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(255,149,0,0.4)]"
                >
                  {isLoggedIn ? 'Profil' : 'Masuk'}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
