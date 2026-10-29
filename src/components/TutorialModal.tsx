import React, { useState } from 'react';
import { Compass, Search, BookOpen, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface TutorialModalProps {
  onClose: () => void;
  onStartExploration: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  onClose,
  onStartExploration
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '1. Gerakkan Detektif 3D',
      desc: 'Gunakan kekunci W, A, S, D atau butang anak panah di papan kekunci. Pada telefon atau tablet, gunakan joystick bulat di sebelah kiri bawah skrin.',
      icon: <Compass className="w-8 h-8 text-amber-400" />,
      tip: 'Detektif boleh berjalan ke hadapan, ke belakang, dan memusingkan badan.'
    },
    {
      title: '2. Hampiri Objek Sekolah',
      desc: 'Berjalan mendekati perabot bilik darjah, kaunter kantin, atau rak buku. Apabila cukup dekat, penunjuk berkilau akan muncul di atas objek.',
      icon: <Search className="w-8 h-8 text-teal-400" />,
      tip: 'Sistem pengesanan jarak akan memberitahu kamu bila objek sedia untuk disiasat.'
    },
    {
      title: '3. Periksa Objek & Baca Ayat',
      desc: 'Tekan kekunci E atau ketuk butang "PERIKSA". Kad bacaan akan dipaparkan. Baca ayat mudah dan pilih jawapan yang sepadan.',
      icon: <BookOpen className="w-8 h-8 text-indigo-400" />,
      tip: 'Fokus pada perkataan kedudukan seperti "di atas", "di bawah", atau "di sebelah".'
    },
    {
      title: '4. Minta Bantuan Jika Perlu',
      desc: 'Jika perlukan bantuan, tekan butang "Minta Bantuan". Sistem akan memberi sorotan perkataan, pecahan frasa, atau contoh berpandu.',
      icon: <HelpCircle className="w-8 h-8 text-emerald-400" />,
      tip: 'Tiada markah ditolak. Belajarlah mengikut rentak kamu sendiri dengan tenang.'
    },
    {
      title: '5. Kumpul 3 Petunjuk Utama',
      desc: 'Kumpulkan 1 petunjuk di bilik darjah, 1 di kantin, dan 1 di perpustakaan. Buka Buku Nota untuk merumus lokasi Kotak Biru!',
      icon: <CheckCircle2 className="w-8 h-8 text-amber-400" />,
      tip: 'Setelah semua 3 petunjuk lengkap, buka Papan Bukti untuk menyelesaikan kes!'
    }
  ];

  const handleNext = () => {
    soundEffects.playInteract();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStartExploration();
    }
  };

  const handlePrev = () => {
    soundEffects.playInteract();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const active = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-lg w-full p-5 md:p-6 shadow-2xl text-white flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
              Panduan Pemain (Tutorial)
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Langkah {currentStep + 1} daripada {steps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Step Body */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-slate-700 flex items-center justify-center shadow-inner">
            {active.icon}
          </div>
          <h3 className="text-lg font-black text-slate-100">
            {active.title}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            {active.desc}
          </p>
          <div className="bg-slate-900/80 border border-slate-700/80 text-amber-200 text-xs px-3 py-2 rounded-xl mt-1 w-full text-left font-medium">
            💡 <strong>Petua:</strong> {active.tip}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStep ? 'w-6 bg-amber-400' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Sebelumnya
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs md:text-sm shadow-md transition-transform active:scale-95"
          >
            <span>{currentStep === steps.length - 1 ? 'Mula Pengembaraan!' : 'Seterusnya'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
