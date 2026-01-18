'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PhoneInput() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+62');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber || phoneNumber.length < 8) {
      setError('Mohon masukkan nomor telepon yang valid');
      return;
    }

    localStorage.setItem('phoneNumber', countryCode + phoneNumber);
    
    router.push('/onboarding/otp');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 mb-6 flex items-center"
        >
          <span className="text-xl mr-2">←</span> Kembali
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Masukkan Nomor Telepon
          </h1>
          <p className="text-gray-600">
            Kami akan mengirim kode verifikasi via WhatsApp
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="+62">🇮🇩 +62</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+65">🇸🇬 +65</option>
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="812345678"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <p className="text-sm text-blue-800">
                Pastikan WhatsApp kamu aktif untuk menerima kode verifikasi.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Kirim Kode Verifikasi
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Dengan melanjutkan, kamu menyetujui{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Syarat & Ketentuan
          </a>{' '}
          dan{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Kebijakan Privasi
          </a>
        </p>
      </div>
    </div>
  );
}
