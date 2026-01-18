'use client';

import { Navbar } from '@/components/Navbar';

export default function NabungBareng() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Nabung Bareng</h1>
            <p className="text-gray-600 text-lg">Coming soon...</p>
          </div>
        </div>
      </div>
    </>
  );
}
