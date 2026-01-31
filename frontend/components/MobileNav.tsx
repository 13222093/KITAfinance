'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, Users, Award, Wallet, User, MessageCircle } from 'lucide-react';

export function MobileNav() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Check if user is logged in - recheck on every pathname change
        const userData = localStorage.getItem('userData');
        const userSession = localStorage.getItem('userSession');
        setIsLoggedIn(!!userData || !!userSession);
    }, [pathname]); // Re-check when route changes after login

    // Don't render bottom nav if user is not logged in
    if (!isLoggedIn) {
        return null;
    }

    // Don't render during onboarding flow
    if (pathname.startsWith('/onboarding')) {
        return null;
    }

    // Don't render on landing, login pages
    if (pathname === '/' || pathname === '/login') {
        return null;
    }



    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Nabung', href: '/nabung-bareng', icon: Users },
        { name: 'Missions', href: '/missions', icon: Award },
        { name: 'Vaults', href: '/vaults', icon: Wallet },
    ];

    const handleChatToggle = () => {
        window.dispatchEvent(new Event('toggle-chat-mobile'));
    };

    return (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-3 shadow-2xl flex justify-around items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${isActive
                                ? 'bg-gradient-to-br from-[#0A98FF] to-[#00FFF0] shadow-lg -translate-y-2 scale-110'
                                : 'hover:bg-white/10 text-white/60'
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white/70'}`} />
                            {isActive && (
                                <div className="absolute -bottom-6">
                                    <div className="w-1 h-1 rounded-full bg-[#00FFF0] shadow-[0_0_8px_#00FFF0]" />
                                </div>
                            )}
                        </Link>
                    );
                })}

                {/* ChatBot Trigger - Standardized Style */}
                <button
                    onClick={handleChatToggle}
                    className="relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 hover:bg-white/10 text-white/60 group"
                >
                    <MessageCircle className="w-6 h-6 group-hover:text-[#C15BFF] transition-colors" />
                </button>
            </div>
        </div>
    );
}
