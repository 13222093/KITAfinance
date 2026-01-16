'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b border-light-gray/20 bg-dark-gray/95 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="heading text-indigo">
              KITA
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/dashboard" className="body-text text-white hover:text-indigo transition-colors">
                Dashboard
              </Link>
              <Link href="/create" className="body-text text-white hover:text-indigo transition-colors">
                Create Position
              </Link>
            </div>
          </div>
          <button className="px-6 py-3 bg-indigo hover:bg-indigo/80 text-white btn-text rounded-lg transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}
