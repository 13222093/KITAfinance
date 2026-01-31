"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Sparkles, TrendingUp, Phone, ArrowRight, CheckCircle2, Zap } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    countryCode: "+62",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const sessionStr = localStorage.getItem('userSession');
    const guestDataStr = localStorage.getItem('userData');
    if (sessionStr || guestDataStr) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleDemoAccount = () => {
    // Auto-fill demo account credentials (backend has hardcoded OTP: 123456)
    setFormData({
      phoneNumber: "81234567890",
      countryCode: "+62"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.phoneNumber || formData.phoneNumber.length < 8) {
      setError("Mohon masukkan nomor telepon yang valid");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/request-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: formData.phoneNumber,
            countryCode: formData.countryCode,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // User exists, send OTP
        localStorage.setItem('countryCode', formData.countryCode);
        localStorage.setItem('phoneNumber', formData.phoneNumber); // Store for verification
        localStorage.setItem('isLoginFlow', 'true');
        router.push('/login/otp');
      } else {
        setError(data.error || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch (err) {
      setError("Gagal menghubungi server. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0A4A7C] via-[#0A98FF] to-[#04877f] overflow-hidden">
      {/* Left Panel - Decorative (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,152,255,0.3),transparent_50%)] animate-pulse" />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#C15BFF] rounded-full blur-3xl opacity-30 animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#FBFF2B] rounded-full blur-3xl opacity-20 animate-float-delayed" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div>
            <h1 className="text-3xl font-black text-white drop-shadow-lg">KITA<span className="font-serif italic font-light tracking-wide text-[#f59e1b] bg-clip-border">finance</span></h1>
            <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm w-fit">
              <Sparkles className="h-3.5 w-3.5 text-[#FBFF2B]" />
              <span className="text-xs font-bold text-white">Powered by Thetanuts V4</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-8">
          <h2 className="text-5xl font-black text-white leading-tight drop-shadow-2xl">
            Selamat Datang<br />
            Kembali ke<br />
            <span className="text-[#FBFF2B]">Platform DeFi Kamu!</span>
          </h2>
          <p className="text-xl text-white/90 font-medium max-w-md leading-relaxed">
            Monetisasi limit orders dengan DeFi options. Nabung sendiri atau bareng temen, sambil
            kumpulin XP dan unlock badges!
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-4">
          {[
            "Cash Secured Put & Covered Call",
            "Gamifikasi Seru - XP & Badges",
            "Nabung Bareng di Group Vault"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl backdrop-blur-sm w-fit border border-white/10 hover:bg-white/20 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-[#0A98FF]" />
              </div>
              <span className="text-white font-bold text-lg">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        {/* Mobile Background Elements */}
        <div className="absolute inset-0 lg:hidden overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[#C15BFF] rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[#00FFF0] rounded-full blur-3xl opacity-20" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-lg text-center">KITA<span className="font-serif italic font-light tracking-wide text-[#FBFF2B] bg-clip-border">finance</span></h1>
              <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full w-fit">
                <Sparkles className="h-3.5 w-3.5 text-[#FBFF2B]" />
                <span className="text-xs font-bold text-white">Powered by Thetanuts V4</span>
              </div>
            </div>
          </div>

          {/* Card - Only visible on desktop (lg+) */}
          <div className="lg:bg-white/95 lg:backdrop-blur-sm lg:rounded-[2.5rem] lg:p-8 lg:shadow-2xl lg:border-4 lg:border-white/50">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white lg:text-[#0A4A7C] mb-2 drop-shadow-lg lg:drop-shadow-none">
                Selamat Datang! 👋
              </h2>
              <p className="text-sm sm:text-base text-white/90 lg:text-gray-500 font-bold">
                Masuk ke akun KITA kamu untuk lanjut
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-600 font-medium rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white lg:text-[#0A4A7C] font-bold drop-shadow lg:drop-shadow-none">Nomor Telepon</Label>
                <div className="flex gap-3">
                  {/* Country Code Select */}
                  <div className="relative">
                    <select
                      value={formData.countryCode}
                      onChange={(e) =>
                        setFormData({ ...formData, countryCode: e.target.value })
                      }
                      className="h-14 w-28 px-3 rounded-xl border-2 border-gray-200 bg-white
                                 text-lg font-bold text-[#0A4A7C] shadow-sm
                                 focus:border-[#0A98FF] focus:outline-none focus:ring-4 focus:ring-[#0A98FF]/10
                                 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none cursor-pointer"
                      disabled={isLoading}
                    >
                      <option value="+62">🇮🇩 +62</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>
                  </div>

                  {/* Phone Number Input */}
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="812345678"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      required
                      disabled={isLoading}
                      className="pl-12 h-14 rounded-xl border-2 border-gray-200 text-lg font-bold text-[#0A4A7C] 
                               focus:border-[#0A98FF] focus:ring-4 focus:ring-[#0A98FF]/10 transition-all placeholder:font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs">ℹ️</span>
                  </div>
                </div>
                <p className="text-sm text-blue-800 font-medium leading-relaxed">
                  Kami akan mengirim kode verifikasi via WhatsApp untuk konfirmasi
                  identitas kamu.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FFBC57] to-[#FF9500] text-white font-black py-6 text-lg rounded-2xl shadow-[0_6px_0_0_#D97706] hover:shadow-[0_8px_0_0_#D97706] hover:-translate-y-1 active:translate-y-0 active:shadow-[0_4px_0_0_#D97706] transition-all border-b-0"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memeriksa...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Kirim Kode Verifikasi</span>
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </Button>

              {/* Divider */}
              <div className="text-center pt-4 border-t-2 border-white/20 lg:border-gray-100">
                <p className="text-white lg:text-gray-500 font-medium">
                  Belum punya akun?{" "}
                  <Link
                    href="/onboarding"
                    className="text-[#00FFF0] lg:text-[#0A4A7C] hover:text-[#FBFF2B] lg:hover:text-[#0A98FF] font-black underline underline-offset-4 decoration-2 decoration-[#00FFF0] lg:decoration-[#00FFF0] hover:decoration-[#FBFF2B] lg:hover:decoration-[#0A98FF] transition-all"
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </div>

              {/* Demo Account Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleDemoAccount}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all border-2 border-purple-300/50 flex items-center justify-center gap-2"
                >
                  <Zap className="h-5 w-5" />
                  <span>Demo Account (OTP: 123456)</span>
                </button>
                <p className="text-xs text-white-500 text-center mt-2 font-medium">
                  Langsung isi nomor demo dengan OTP 123456
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-white/60 font-medium mt-8">
            © 2026 KITA - Kolektif Investasi Tanpa Ambyar
          </p>

          {/* Terms */}
          <p className="text-xs text-white/40 mt-4 text-center">
            Dengan melanjutkan, kamu menyetujui{" "}
            <a href="#" className="text-white/80 hover:text-white hover:underline font-bold transition-colors">
              Syarat & Ketentuan
            </a>{" "}
            dan{" "}
            <a href="#" className="text-white/80 hover:text-white hover:underline font-bold transition-colors">
              Kebijakan Privasi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
