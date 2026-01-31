"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Sparkles, TrendingUp, Phone, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";

export default function PhoneInput() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+62");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!phoneNumber || phoneNumber.length < 8) {
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
            phoneNumber: phoneNumber,
            countryCode: countryCode,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("countryCode", countryCode);
        localStorage.setItem("phoneNumber", phoneNumber);
        router.push("/onboarding/otp");
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
    <div className="min-h-screen flex bg-primary-50">
      {/* Left Panel - Decorative (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0284C7] to-[#06B6D4] p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-white">KITA<span className="font-serif italic font-light tracking-wide text-[#f59e1b] bg-clip-border">finance</span></h1>
              <div className="flex items-center gap-1 w-fit">
                <Sparkles className="h-3.5 w-3.5 text-secondary-400" />
                <span className="text-xs font-bold text-secondary-400">Powered by Thetanuts V4</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Verifikasi<br />
            Nomor Telepon<br />
            <span className="text-secondary-400">Kamu 📱</span>
          </h2>
          <p className="text-lg text-cyan-50 font-medium max-w-md">
            Kami akan mengirim kode verifikasi via WhatsApp untuk memastikan nomor telepon kamu
            valid dan aman.
          </p>
        </div>

        {/* Security Features */}
        <div className="relative z-10 space-y-3">
          {[
            "Verifikasi cepat via WhatsApp",
            "Data pribadi terenkripsi",
            "Sistem keamanan berlapis"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-hard-sm">
                <CheckCircle2 className="h-5 w-5 text-[#06B6D4]" />
              </div>
              <span className="text-white font-semibold">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div>
              <h1 className="text-xl font-extrabold text-[#0A4A7C]">KITA<span className="font-serif italic font-light tracking-wide text-[#f59e1b]">finance</span></h1>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-secondary-500" />
                <span className="text-xs font-bold text-secondary-600">DeFi Options</span>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-6 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali</span>
          </button>

          {/* Card */}
          <div className="bg-white rounded-3xl border-2 border-primary-100 p-8 shadow-[0_8px_0_0_#e0f2fe]">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-[#0A4A7C] mb-2">
                Masukkan Nomor Telepon 📱
              </h2>
              <p className="text-primary-600 font-medium">
                Kami akan kirim kode verifikasi via WhatsApp
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Nomor Telepon</Label>
                <div className="flex gap-2">
                  {/* Country Code Select */}
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-12 w-24 px-3 rounded-xl border-2 border-primary-100 bg-white
                                 text-base font-medium text-stone-900 shadow-[0_2px_0_0_#e0f2fe]
                                 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                                 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="+62">🇮🇩 +62</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>
                  </div>

                  {/* Phone Number Input */}
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-300" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="812345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                      required
                      className="pl-12"
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary-50 border-2 border-primary-100 rounded-2xl p-4">
                <p className="text-sm text-primary-700 font-medium">
                  📱 Pastikan WhatsApp kamu aktif untuk menerima kode verifikasi.
                </p>
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="primary" size="lg" fullWidth>
                <div className="flex items-center gap-2">
                  <span>Kirim Kode Verifikasi</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Button>

              {/* Terms */}
              <p className="text-xs text-stone-500 text-center pt-4">
                Dengan melanjutkan, kamu menyetujui{" "}
                <a href="#" className="text-primary-600 hover:underline font-medium">
                  Syarat & Ketentuan
                </a>{" "}
                dan{" "}
                <a href="#" className="text-primary-600 hover:underline font-medium">
                  Kebijakan Privasi
                </a>
              </p>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-primary-400 font-medium mt-6">
            © 2026 KITA - Kolektif Investasi Tanpa Ambyar
          </p>
        </div>
      </div>
    </div>
  );
}
