'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OnboardingSuccess() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('userData');
    if (data) {
      setUserData(JSON.parse(data));
    } else {
      router.push('/onboarding');
    }
  }, [router]);

  const handleContinue = () => {
    router.push('/dashboard');
  };

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4 animate-wiggle">
            <span className="text-5xl">🎉</span>
          </div>
          <h1 className="text-heading text-gray-800 mb-2">
            Halo, {userData.fullName}!
          </h1>
          <p className="text-body text-gray-600 mb-4">
            Akun berhasil dibuat
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-body text-gray-700">
              <span className="text-button">Username:</span> @{userData.username}
            </p>
            <p className="text-body text-gray-700 mt-1">
              <span className="text-button">Email:</span> {userData.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-button py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 mb-4"
        >
          Mulai dengan KITA
        </button>

      </div>
    </div>
  );
}
