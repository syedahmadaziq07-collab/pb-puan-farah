import React from 'react';
import {
  Play,
  RotateCcw,
  BookOpen,
  Settings,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface MainMenuProps {
  hasExistingSession: boolean;
  onStartNewMission: () => void;
  onContinueMission: () => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
  onOpenTeacherPortal: () => void;
  learnerCode?: string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  hasExistingSession,
  onStartNewMission,
  onContinueMission,
  onOpenTutorial,
  onOpenSettings,
  onOpenTeacherPortal,
  learnerCode
}) => {
  const handleStart = () => {
    soundEffects.playSuccess();
    if (hasExistingSession) {
      if (confirm('Adakah kamu pasti mahu memulakan siasatan baharu? Kemajuan semasa akan digantikan.')) {
        onStartNewMission();
      }
    } else {
      onStartNewMission();
    }
  };

  const handleContinue = () => {
    soundEffects.playInteract();
    onContinueMission();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="bg-slate-900/95 border-2 border-amber-400/80 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl text-white flex flex-col items-center text-center gap-5">
        {/* Game Title Badge */}
        <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-400/40 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Bahan Bantu Belajar Digital (HPPK 2)</span>
        </div>

        {/* Main Title */}
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase drop-shadow-md">
            Detektif Cilik <span className="text-amber-400">3D</span>
          </h1>
          <h2 className="text-lg md:text-xl font-extrabold text-teal-300 mt-1">
            Misteri Kotak Hilang
          </h2>
        </div>

        {/* Story Introduction Brief */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 text-xs text-slate-300 leading-relaxed max-w-md">
          Satu kotak biru berisi alatan seni telah hilang selepas kelas seni. Jadilah Detektif Cilik dan terokai bilik darjah, kantin, serta perpustakaan sekolah secara tiga dimensi untuk mencari petunjuk dan menyelesaikan misteri!
        </div>

        {/* Learner indicator if selected */}
        {learnerCode && (
          <div className="text-xs text-slate-400">
            Sesi Murid: <strong className="text-amber-300 font-mono">{learnerCode}</strong>
          </div>
        )}

        {/* Menu Buttons */}
        <div className="flex flex-col gap-2.5 w-full max-w-xs">
          {/* Start New Mission */}
          <button
            onClick={handleStart}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-2 border-white"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>Mula Siasatan</span>
          </button>

          {/* Continue Mission */}
          {hasExistingSession && (
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs md:text-sm rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 border border-teal-400"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Sambung Siasatan</span>
            </button>
          )}

          {/* Tutorial */}
          <button
            onClick={() => {
              soundEffects.playInteract();
              onOpenTutorial();
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Panduan & Tutorial Detektif</span>
          </button>

          {/* Accessibility Settings */}
          <button
            onClick={() => {
              soundEffects.playInteract();
              onOpenSettings();
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4 text-teal-400" />
            <span>Tetapan Kebolehcapaian</span>
          </button>
        </div>

        {/* Teacher Portal Link */}
        <div className="border-t border-slate-800/80 pt-3 w-full">
          <button
            onClick={() => {
              soundEffects.playInteract();
              onOpenTeacherPortal();
            }}
            className="text-xs font-semibold text-teal-300 hover:text-teal-200 flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Portal Guru: Penilaian & Dashboard Kemajuan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
