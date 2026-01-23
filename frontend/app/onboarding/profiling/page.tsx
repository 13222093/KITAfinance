'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const QUESTIONS = [
  {
    id: 1,
    question: 'Berapa lama pengalaman kamu dalam investasi kripto?',
    options: [
      { value: 'beginner', label: 'Baru mulai (< 6 bulan)', emoji: '🌱' },
      { value: 'intermediate', label: 'Cukup berpengalaman (6 bulan - 2 tahun)', emoji: '📈' },
      { value: 'advanced', label: 'Super berpengalaman (> 2 tahun)', emoji: '🚀' },
    ],
  },
  {
    id: 2,
    question: 'Apa tujuan investasi utama kamu?',
    options: [
      { value: 'passive_income', label: 'Cari passive income rutin', emoji: '💰' },
      { value: 'capital_growth', label: 'Nambah modal/aset jangka panjang', emoji: '📊' },
      { value: 'learning', label: 'Belajar sambil investasi', emoji: '🎓' },
    ],
  },
  {
    id: 3,
    question: 'Seberapa besar risiko yang bisa kamu terima?',
    options: [
      { value: 'conservative', label: 'Konservatif - Aman & stabil', emoji: '🛡️' },
      { value: 'moderate', label: 'Moderat - Seimbang antara aman & cuan', emoji: '⚖️' },
      { value: 'aggressive', label: 'Agresif - High risk, high return', emoji: '🎯' },
    ],
  },
  {
    id: 4,
    question: 'Berapa dana yang ingin kamu investasikan per bulan?',
    options: [
      { value: 'small', label: 'Rp 100K - 500K', emoji: '💵' },
      { value: 'medium', label: 'Rp 500K - 2 Juta', emoji: '💸' },
      { value: 'large', label: '> Rp 2 Juta', emoji: '💎' },
    ],
  },
];

export default function AIProfilingPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => { // Make sure user datang dari halaman lengkapi profil
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.push('/onboarding');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse">
              <span className="text-4xl">🤖</span>
            </div>
            <h2 className="text-subheading text-gray-800 mb-2">Menganalisis Profil Kamu...</h2>
            <p className="text-body text-gray-600">AI kami sedang menyesuaikan strategi terbaik untuk kamu</p>
          </div>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-body text-gray-600">
              Pertanyaan {currentQuestion + 1} dari {QUESTIONS.length}
            </span>
            <span className="text-body text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="inline-block px-4 py-2 bg-blue-50 rounded-full mb-4">
            <span className="text-blue-600 text-body">🤖 AI Profiling</span>
          </div>
          <h2 className="text-heading text-gray-800 mb-2">{question.question}</h2>
          <p className="text-body text-gray-600">Pilih jawaban yang paling sesuai dengan kondisi kamu</p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                answers[currentQuestion] === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{option.emoji}</div>
                <div className="flex-1">
                  <div className="text-subheading text-gray-800">{option.label}</div>
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {answers[currentQuestion] === option.value && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
        <div className="mt-6 text-center">
          <p className="text-body text-gray-500">
            Informasi ini membantu kami memberikan rekomendasi strategi yang tepat untuk kamu
          </p>
        </div>
      </div>
    </div>
  );
}
