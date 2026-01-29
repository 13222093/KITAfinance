'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function LoginOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { // Make sure ini login flow (datang dari halaman login)
    const isLogin = localStorage.getItem('isLoginFlow');
    const phone = localStorage.getItem('phoneNumber');
    
    if (!isLogin || !phone) {
      router.push('/login');
      return;
    }
    
    setPhoneNumber(phone);
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit !== '') && index === 5) { // Auto-submit
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);

    if (newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleVerify = async (code: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber, // This should be the FULL phone number stored in localStorage
          code: code,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem('isLoginFlow');
        localStorage.setItem('userSession', JSON.stringify(data.data)); // Store session
        router.push('/dashboard');
      } else {
        setError(data.error || 'Kode verifikasi salah. Silakan coba lagi.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Gagal verifikasi. Periksa koneksi internet Anda.');
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    
    // Simulasi ngirim ulang kode verif
    setCountdown(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    
    alert('Verification code sent!');
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

        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl">💬</span>
          </div>
          <h1 className="text-heading text-gray-800 mb-2">
            Verifikasi Nomor
          </h1>
          <p className="text-body text-gray-600">
            Ketik kode 6 digit yang dikirim ke
          </p>
          <p className="text-body text-gray-800 font-semibold">
            {phoneNumber}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {inputRefs.current[index] = el}}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-500 bg-white"
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 text-body text-center">{error}</p>
          )}
        </div>

        <div className="text-center mb-6">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-blue-600 text-button hover:underline"
            >
              Kirim Ulang Kode
            </button>
          ) : (
            <p className="text-body text-gray-600">
              Kirim ulang kode dalam{' '}
              <span className="text-button text-blue-600">{countdown}s</span>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
