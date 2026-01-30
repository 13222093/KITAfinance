'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function LoginOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');1
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { // Make sure ini login flow (datang dari halaman login)
    const isLogin = localStorage.getItem('isLoginFlow');
    const phone = localStorage.getItem('phoneNumber');
    const country = localStorage.getItem('countryCode');
    
    if (!isLogin || !phone || !country) {
      router.push('/login');
      return;
    }

    setPhoneNumber(phone);
    setCountryCode(country);
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
          phoneNumber: phoneNumber,
          countryCode: countryCode,
          code: code,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem('isLoginFlow');
        localStorage.setItem('userSession', JSON.stringify(data.data)); // Store session

        // Check if user has completed onboarding (has a name)
        if (data.data.name) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding/profile');
        }
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
    <div className="min-h-screen bg-gradient-to-br from-[#0A4A7C] via-[#0A98FF] to-[#04877f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,152,255,0.3),transparent_50%)] animate-pulse pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#C15BFF] rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FBFF2B] rounded-full blur-3xl opacity-10 animate-float-delayed" />
      </div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-white/50 relative z-10">
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-[#0A4A7C] mb-6 flex items-center font-bold transition-colors"
        >
          <span className="text-xl mr-2">←</span> Kembali
        </button>

        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner">
            <span className="text-3xl">💬</span>
          </div>
          <h1 className="text-2xl font-black text-[#0A4A7C] mb-2">
            Verifikasi Nomor
          </h1>
          <p className="text-gray-500 font-medium">
            Ketik kode 6 digit yang dikirim ke
          </p>
          <p className="text-body text-gray-800 font-semibold">
            {`${countryCode}-${phoneNumber}`}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-black border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0A98FF] focus:ring-4 focus:ring-[#0A98FF]/10 text-[#0A4A7C] bg-white transition-all shadow-sm"
              />
            ))}
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
              <p className="text-red-500 font-bold text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="text-center mb-2">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-[#0A98FF] font-black hover:underline hover:text-[#0A4A7C] transition-colors"
            >
              Kirim Ulang Kode
            </button>
          ) : (
            <p className="text-gray-500 font-medium">
              Kirim ulang kode dalam{' '}
              <span className="font-bold text-[#0A98FF]">{countdown}s</span>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
