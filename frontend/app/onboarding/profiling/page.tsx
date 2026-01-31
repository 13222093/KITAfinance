'use client';

import { useRouter } from next / navigation';
import { useState, useEffect } from 'react';
import { Sparkles, Zap, TrendingUp, Shield } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: 'Berapa lama pengalaman kamu dalam investasi kripto?',
    options: [
      { value: 'beginner', label: 'Baru mulai', detail: '< 6 bulan', emoji: '🌱' },
      { value: 'intermediate', label: 'Cukup berpengalaman', detail: '6 bulan - 2 tahun', emoji: '📈' },
      { value: 'advanced', label: 'Super pro', detail: '> 2 tahun', emoji: '🚀' },
    ],
  },
  {
    id: 2,
    question: 'Apa tujuan investasi utama kamu?',
    options: [
      { value: 'passive_income', label: 'Passive Income', detail: 'Cuan rutin', emoji: '💰' },
      { value: 'capital_growth', label: 'Capital Growth', detail: 'Aset jangka panjang', emoji: '📊' },
      { value: 'learning', label: 'Belajar Dulu', detail: 'Sambil investasi', emoji: '🎓' },
    ],
  },
  {
    id: 3,
    question: 'Seberapa besar risiko yang bisa kamu terima?',
    options: [
      { value: 'conservative', label: 'Konservatif', detail: 'Aman & stabil', emoji: '🛡️' },
      { value: 'moderate', label: 'Moderat', detail: 'Seimbang', emoji: '⚖️' },
      { value: 'aggressive', label: 'Agresif', detail: 'High risk, high return', emoji: '🎯' },
    ],
  },
  {
    id: 4,
    question: 'Berapa dana yang ingin kamu investasikan per bulan?',
    options: [
      { value: 'small', label: 'Rp 100K - 500K', detail: 'Pemula', emoji: '💵' },
      { value: 'medium', label: 'Rp 500K - 2 Juta', detail: 'Menengah', emoji: '💸' },
      { value: 'large', label: '> Rp 2 Juta', detail: 'Serius', emoji: '💎' },
    ],
  },
];

export default function AIProfilingPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const sessionStr = localStorage.getItem('userSession');
    const userData = localStorage.getItem('userData');

    if (!sessionStr && !userData) {
      router.push('/onboarding');
      return;
    }

    if (localStorage.getItem('userProfiling')) {
      router.push('/onboarding/mode');
    }
  }, [router]);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      handleFinishProfiling(newAnswers);
    }
  };

  const handleFinishProfiling = (finalAnswers: Record<number, string>) => {
    setIsAnalyzing(true);

    const profilingData = {
      experience: finalAnswers[0],
      goal: finalAnswers[1],
      riskTolerance: finalAnswers[2],
      monthlyInvestment: finalAnswers[3],
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem('userProfiling', JSON.stringify(profilingData));

    setTimeout(() => {
      router.push('/onboarding/mode');
    }, 2000);
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const question = QUESTIONS[currentQuestion];

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#C15BFF] via-[#0A98FF] to-[#0A4A7C] flex items-center justify-center p-4 md:p-8">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,152,255,0.3),transparent_50%)] animate-pulse" />

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#FBFF2B] rounded-full blur-3xl opacity-20 animate-float" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#00FFF0] rounded-full blur-3xl opacity-15 animate-float-delayed" />
        </div>

        <div className="relative z-10 max-w-md w-full bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#0A98FF] to-[#C15BFF] rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse shadow-xl">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[#0A4A7C] mb-2">Menganalisis Profil Kamu...</h2>
            <p className="text-sm md:text-base text-gray-600 font-semibold">AI kami sedang menyesuaikan strategi terbaik untuk kamu</p>
          </div>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-[#0A98FF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-[#C15BFF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-[#00FFF0] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C15BFF] via-[#0A98FF] to-[#0A4A7C] overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(10,152,255,0.3),transparent_50%)] animate-pulse" />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 md:top-20 left-5 md:left-10 w-48 md:w-64 h-48 md:h-64 bg-[#FBFF2B] rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-64 md:w-80 h-64 md:h-80 bg-[#00FFF0] rounded-full blur-3xl opacity-15 animate-float-delayed" />
      </div>

      {/* Floating Icons - Gamification Theme */}
      <div className="absolute top-16 md:top-20 right-4 md:right-8 animate-bounce" style={{ animationDelay: '0.2s' }}>
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#FBFF2B] to-[#FFBC57] rounded-xl flex items-center justify-center shadow-xl rotate-12 backdrop-blur-sm border-2 border-white/30">
          <Zap className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-lg" />
        </div>
      </div>

      <div className="absolute top-28 md:top-32 left-8 md:left-12 animate-pulse" style={{ animationDelay: '0.5s' }}>
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#00FFF0] to-[#0A98FF] rounded-lg flex items-center justify-center shadow-xl -rotate-12 backdrop-blur-sm border-2 border-white/30">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white drop-shadow-lg" />
        </div>
      </div>

      <div className="absolute bottom-20 md:bottom-24 left-6 md:left-8 animate-spin-slow">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/40">
          <Shield className="w-6 h-6 md:w-7 md:h-7 text-white drop-shadow-lg" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Header */}
        <div className="w-full max-w-2xl mb-6 md:mb-8 text-center">
          <div className="inline-block bg-gradient-to-r from-[#FBFF2B] to-[#FFBC57] text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-bold mb-3 md:mb-4 shadow-lg">
            🤖 AI PROFILING
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-lg mb-2">
            Kenalan Yuk! 👋
          </h1>
          <p className="text-sm md:text-base text-white/90 font-semibold">
            Bantu kami pahami kebutuhan investasi kamu
          </p>
        </div>

        {/* Progress Bar - Mobile Optimized */}
        <div className="w-full max-w-2xl mb-6 md:mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/20 shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs md:text-sm font-bold text-white">
                Pertanyaan {currentQuestion + 1} dari {QUESTIONS.length}
              </span>
              <span className="text-xs md:text-sm font-black text-[#FBFF2B]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 md:h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FBFF2B] to-[#FFBC57] transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card - Mobile First */}
        <div className="w-full max-w-2xl bg-white rounded-2xl md:rounded-3xl shadow-2xl p-5 md:p-8 border-2 border-white/50">
          {/* Question */}
          <div className="mb-5 md:mb-6">
            <h2 className="text-lg md:text-xl lg:text-2xl font-black text-[#0A4A7C] mb-2 md:mb-3 leading-tight">
              {question.question}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 font-semibold">
              Pilih jawaban yang paling sesuai dengan kondisi kamu
            </p>
          </div>

          {/* Options - Mobile Optimized */}
          <div className="space-y-3 md:space-y-4">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-4 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all duration-200 text-left
                  ${answers[currentQuestion] === option.value
                    ? 'border-[#0A98FF] bg-gradient-to-br from-[#0A98FF]/10 to-[#C15BFF]/10 shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:border-[#0A98FF]/50 hover:bg-gray-50 active:scale-[0.98]'
                  }`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Emoji */}
                  <div className="text-3xl md:text-4xl flex-shrink-0">{option.emoji}</div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm md:text-base lg:text-lg font-black text-gray-800 mb-0.5">
                      {option.label}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 font-semibold">
                      {option.detail}
                    </div>
                  </div>

                  {/* Radio Button */}
                  <div
                    className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${answers[currentQuestion] === option.value
                        ? 'border-[#0A98FF] bg-[#0A98FF] shadow-lg'
                        : 'border-gray-300'
                      }`}
                  >
                    {answers[currentQuestion] === option.value && (
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Helper Text */}
          <div className="mt-5 md:mt-6 text-center">
            <p className="text-xs md:text-sm text-gray-500 font-semibold">
              💡 Informasi ini membantu kami memberikan rekomendasi strategi yang tepat
            </p>
          </div>
        </div>

        {/* Footer hint - Mobile friendly */}
        <div className="mt-6 md:mt-8 text-center">
          <p className="text-xs md:text-sm text-white/80 font-semibold">
            Tenang, data kamu aman dan hanya untuk personalisasi pengalaman investasi 🔒
          </p>
        </div>
      </div>
    </div>
  );
}
