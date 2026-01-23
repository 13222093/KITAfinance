'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    countryCode: '+62',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.phoneNumber || formData.phoneNumber.length < 8) {
      setError('Mohon masukkan nomor telepon yang valid');
      setIsLoading(false);
      return;
    }

    // TODOLIST: Ini masih simulasi cek nomor terdaftar atau nggak
    setTimeout(() => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const storedPhone = localStorage.getItem('phoneNumber');
        
        if (storedPhone === formData.countryCode + formData.phoneNumber) {
          // User exists, send OTP
          localStorage.setItem('phoneNumber', formData.countryCode + formData.phoneNumber);
          localStorage.setItem('isLoginFlow', 'true');
          router.push('/login/otp');
        } else {
          setError('Nomor telepon belum terdaftar. Silakan daftar terlebih dahulu.');
        }
      } else {
        setError('Nomor telepon belum terdaftar. Silakan daftar terlebih dahulu.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-white text-3xl font-bold">K</span>
          </div>
          <h1 className="text-heading text-gray-800 mb-2">
            Selamat Datang Kembali
          </h1>
          <p className="text-body text-gray-600">
            Masuk ke akun KITA kamu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-body text-gray-700 mb-2">
              Nomor Telepon
            </label>
            <div className="flex gap-2">
              <select
                value={formData.countryCode}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                className="w-24 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="+62">🇮🇩 +62</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+65">🇸🇬 +65</option>
              </select>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                placeholder="812345678"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-red-500 text-body mt-2">{error}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <p className="text-body text-blue-800">
                Kami akan mengirim kode verifikasi via WhatsApp untuk konfirmasi identitas kamu.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-button py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Memeriksa...' : 'Kirim Kode Verifikasi'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-body text-gray-600 mb-2">
            Belum punya akun?
          </p>
          <button
            onClick={() => router.push('/onboarding')}
            className="text-blue-600 text-button hover:underline"
          >
            Daftar Sekarang
          </button>
        </div>

        <p className="text-body text-gray-500 mt-6 text-center">
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
