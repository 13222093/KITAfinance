"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function OnboardingWelcome() {
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const sessionStr = localStorage.getItem('userSession');
    const guestDataStr = localStorage.getItem('userData');
    if (sessionStr || guestDataStr) {
      router.push('/dashboard');
    }
  }, [router]);

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
            Mulai Perjalanan<br />
            DeFi Kamu<br />
            <span className="text-[#FBFF2B] text-6xl">Hari Ini! 🚀</span>
          </h2>
          <p className="text-xl text-white/90 font-medium max-w-md leading-relaxed">
            Bergabung dengan ribuan investor yang sudah monetisasi limit orders mereka dengan
            strategi DeFi options yang seru dan menguntungkan!
          </p>
        </div>

        {/* Benefits */}
        <div className="relative z-10 space-y-4">
          {[
            "Gratis untuk memulai",
            "Gamifikasi - Kumpulin XP & Badges",
            "Nabung solo atau bareng temen"
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl backdrop-blur-sm w-fit border border-white/10 hover:bg-white/20 transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-[#0A98FF]" />
              </div>
              <span className="text-white font-bold text-lg">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Welcome Card */}
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
          <div className="lg:bg-white/95 lg:backdrop-blur-sm lg:rounded-[2.5rem] lg:p-8 lg:shadow-2xl lg:border-4 lg:border-white/50 lg:transform lg:hover:scale-[1.01] lg:transition-transform lg:duration-300">
            <div className="text-center mb-6 sm:mb-8">
              {/* Icon Badge */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br from-[#FBFF2B] to-[#FFBC57] lg:from-[#0A98FF] lg:to-[#04877f] rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform border-4 border-white/30">
                <Zap className="h-12 w-12 text-white" />
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white lg:text-[#0A4A7C] mb-3 drop-shadow-lg lg:drop-shadow-none">
                Selamat Datang di KITA! 🎉
              </h2>
              <p className="text-sm sm:text-base text-white/90 lg:text-gray-500 font-bold">
                Platform DeFi options terpercaya untuk kamu
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {[
                "💰 Cash Secured Put & Covered Call",
                "🎮 Gamifikasi - XP, Badges, Streaks",
                "👥 Nabung bareng di group vault",
                "📊 Built on Base - Cepat & Murah"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-white lg:text-gray-700 bg-white/10 lg:bg-blue-50/50 backdrop-blur-sm p-3 rounded-xl border border-white/20 lg:border-blue-50 hover:bg-white/20 lg:hover:bg-blue-50 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-[#0A98FF] flex-shrink-0" />
                  <span className="text-sm font-bold">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => router.push("/onboarding/phone")}
              className="w-full bg-gradient-to-r from-[#00FFF0] to-[#0A98FF] text-white font-black py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] border-b-4 border-black/10 active:border-b-0 active:translate-y-1 transition-all mb-4"
              size="lg"
            >
              <div className="flex items-center justify-center gap-2">
                <span>Mulai dengan KITA</span>
                <ArrowRight className="h-6 w-6" />
              </div>
            </Button>

            {/* Divider */}
            <div className="text-center pt-4 border-t-2 border-gray-100">
              <p className="text-gray-500 font-medium">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="text-[#0A4A7C] hover:text-[#0A98FF] font-black underline underline-offset-4 decoration-2 decoration-[#00FFF0] hover:decoration-[#0A98FF] transition-all"
                >
                  Masuk
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-white/60 font-medium mt-8">
            © 2026 KITA - Kolektif Investasi Tanpa Ambyar
          </p>
        </div>
      </div>
    </div>
  );
}
