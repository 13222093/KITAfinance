'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    setIsLoggedIn(!!userData);
  }, []);

  // Note: Setelah login, jangan arahin ke landing page lagi, tapi ke dashboardnya user
  
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-4">
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/50 shadow-xl">
        <div className="px-6 sm:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link
                href={isLoggedIn ? "/dashboard" : "/"}
                className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                KITA
              </Link>
              <div className="hidden md:flex gap-6">
                <Link 
                  href={isLoggedIn ? "/dashboard" : "/login"} 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href={isLoggedIn ? "/nabung-bareng" : "/login"} 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Nabung Bareng
                </Link>
                <Link 
                  href={isLoggedIn ? "/missions" : "/login"} 
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Missions
                </Link>
              </div>
            </div>
            <Link 
              href={isLoggedIn ? "/profil" : "/login"} 
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 text-white font-semibold rounded-xl transition-all duration-200"
            >
              {isLoggedIn ? 'Profil' : 'Masuk'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
