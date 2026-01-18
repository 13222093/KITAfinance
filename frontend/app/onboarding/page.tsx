'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OnboardingWelcome() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-white text-4xl font-bold">K</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Selamat Datang di KITA
          </h1>
          <p className="text-gray-600">
            Platform investasi kripto terpercaya untuk kamu
          </p>
        </div>

        <button
          onClick={() => router.push('/onboarding/phone')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          Mulai dengan KITA
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Sudah punya akun?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Masuk
          </button>
        </p>
      </div>
    </div>
  );
}
