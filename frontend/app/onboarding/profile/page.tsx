'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CompleteProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => { // Make sure user datang dari halaman verif otp
    const phone = localStorage.getItem('phoneNumber');
    if (!phone) {
      router.push('/onboarding/phone');
    } else {
      setPhoneNumber(phone);
    }
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama Lengkap dibutuhkan';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email dibutuhkan';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Mohon masukkan email yang valid';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username dibutuhkan';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username harus terdiri dari minimal 3 karakter';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username hanya boleh mengandung huruf, angka, dan garis bawah';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Kamu harus menyetujui syarat dan ketentuan';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      ...formData,
      phoneNumber,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    router.push('/onboarding/profiling');
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
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
          <h1 className="text-heading text-gray-800 mb-2">
            Lengkapi Profil
          </h1>
          <p className="text-body text-gray-600">
            Hanya beberapa detail lagi untuk memulai
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-body text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
            {errors.fullName && (
              <p className="text-red-500 text-body mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-body text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
            {errors.email && (
              <p className="text-red-500 text-body mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-body text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value.toLowerCase())}
              placeholder="johndoe123"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
            {errors.username && (
              <p className="text-red-500 text-body mt-1">{errors.username}</p>
            )}
            <p className="text-body text-gray-500 mt-1">
              Ini akan menjadi pengenal unikmu
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-body text-gray-700 mb-2">
              <span className="text-button">Nomor Telepon:</span> {phoneNumber}
            </p>
            <p className="text-body text-gray-500">Terverifikasi ✓</p>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 text-gray-900 bg-white"
            />
            <label htmlFor="agreeToTerms" className="ml-2 text-body text-gray-700">
              Saya setuju dengan{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Syarat Layanan
              </a>{' '}
              dan{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Kebijakan Privasi
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-red-500 text-body">{errors.agreeToTerms}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-button py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Lengkapi Pendaftaran
          </button>
        </form>
      </div>
    </div>
  );
}
