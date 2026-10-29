import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Compass,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { MissionId, ClueItem } from '../types/game';
import { InteractiveSpot } from '../game3d/GameEngine';

interface HUDProps {
  currentMission: MissionId;
  clues: ClueItem[];
  activeSpot: InteractiveSpot | null;
  onOpenNotebook: () => void;
  onOpenEvidenceBoard: () => void;
  onOpenTeacherPortal: () => void;
  onOpenSettings: () => void;
  onTeleport: (room: 'hallway' | 'bilik_darjah' | 'kantin' | 'perpustakaan') => void;
  onInteract: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
  companionMessage: string;
}

export const HUD: React.FC<HUDProps> = ({
  currentMission,
  clues,
  activeSpot,
  onOpenNotebook,
  onOpenEvidenceBoard,
  onOpenTeacherPortal,
  onOpenSettings,
  onTeleport,
  onInteract,
  isSoundMuted,
  onToggleSound,
  companionMessage
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);

  // Friendly mission titles in Bahasa Melayu
  const missionLabels: Record<MissionId, { title: string; objective: string }> = {
    tutorial: {
      title: 'Tutorial Asas Detektif',
      objective: 'Ketahui cara bergerak dan memeriksa perabot sekolah.'
    },
    bilik_darjah: {
      title: 'Misi 1: Bilik Darjah',
      objective: 'Cari nota seni dan kenal pasti kedudukan objek di bilik darjah.'
    },
    kantin: {
      title: 'Misi 2: Kantin Sekolah',
      objective: 'Siasat jejak perjalanan Ali dan susun urutan peristiwa.'
    },
    perpustakaan: {
      title: 'Misi 3: Perpustakaan',
      objective: 'Cari kotak biru di sebelah rak buku perpustakaan!'
    },
    papan_bukti: {
      title: 'Papan Bukti Akhir',
      objective: 'Gabungkan petunjuk untuk mengesahkan lokasi Kotak Biru.'
    }
  };

  const currentInfo = missionLabels[currentMission] || missionLabels.bilik_darjah;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-3 select-none">
      {/* ---------------- TOP STATUS BAR ---------------- */}
      <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        {/* Left: Mission Info & Detective Badge */}
        <div className="flex items-center gap-2 bg-slate-900/90 text-white px-3 py-2 rounded-xl border border-slate-700/80 shadow-lg">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
                {currentInfo.title}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                Petunjuk: {clues.length}/3
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium truncate max-w-xs md:max-w-md">
              {currentInfo.objective}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Evidence Notebook Button */}
          <button
            onClick={onOpenNotebook}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 border border-amber-300"
          >
            <BookOpen className="w-4 h-4" />
            <span>Buku Nota</span>
            {clues.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] flex items-center justify-center font-black">
                {clues.length}
              </span>
            )}
          </button>

          {/* Final Evidence Board Button if 3 clues collected */}
          {clues.length >= 3 && (
            <button
              onClick={onOpenEvidenceBoard}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 border border-indigo-400"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Selesaikan Kes!</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label="Bunyi"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-md transition-all"
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Accessibility Settings */}
          <button
            onClick={onOpenSettings}
            aria-label="Kebolehcapaian"
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-md transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Teacher Portal */}
          <button
            onClick={onOpenTeacherPortal}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-teal-800/90 hover:bg-teal-700 text-teal-100 font-semibold text-xs border border-teal-600 shadow-md transition-all"
          >
            <GraduationCap className="w-4 h-4 text-teal-300" />
            <span className="hidden sm:inline">Portal Guru</span>
          </button>
        </div>
      </div>

      {/* ---------------- CENTER INTERACTION PROMPT ---------------- */}
      {activeSpot && (
        <div className="pointer-events-auto self-center mb-4 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={onInteract}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-2xl border-2 border-white transition-all transform hover:scale-105 active:scale-95"
          >
            <span className="w-7 h-7 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center font-extrabold text-xs">
              E
            </span>
            <div className="text-left">
              <span className="block text-[11px] uppercase tracking-wider text-slate-900/80 font-bold">
                {activeSpot.locationName}
              </span>
              <span className="text-sm font-extrabold">{activeSpot.name}</span>
            </div>
          </button>
        </div>
      )}

      {/* ---------------- COMPANION MASCOT "SI KANCIL" BALLOON ---------------- */}
      <div className="pointer-events-auto self-start ml-2 mb-2 max-w-sm">
        <div className="bg-amber-100/95 text-slate-900 border-2 border-amber-300 px-3.5 py-2 rounded-2xl rounded-bl-sm shadow-lg flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
            🦌
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
              Kawan Detektif (Si Kancil)
            </span>
            <p className="text-xs font-semibold leading-relaxed text-slate-800">
              {companionMessage}
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- COLLAPSIBLE BOTTOM DOCK (Three.js Skill Directive) ---------------- */}
      <div
        style={{
          maxWidth: 'min(920px, 94vw)',
          transform: isDockCollapsed ? 'translate(-50%, calc(100% - 28px))' : 'translate(-50%, 0)'
        }}
        className="pointer-events-auto fixed bottom-3 left-1/2 transition-transform duration-300 ease-out z-20 flex flex-col items-center"
      >
        {/* Toggle Pill */}
        <button
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 text-slate-300 text-[11px] font-semibold rounded-t-lg border-t border-x border-slate-700 hover:text-white transition-colors"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Tunjukkan Kawalan</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Sembunyikan Kawalan</span>
            </>
          )}
        </button>

        {/* Dock Container */}
        <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 w-full">
          {/* Location Fast-Travel Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              Lokasi:
            </span>
            <button
              onClick={() => onTeleport('hallway')}
              className="px-2.5 py-1 text-xs rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Lorong
            </button>
            <button
              onClick={() => onTeleport('bilik_darjah')}
              className="px-2.5 py-1 text-xs rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Bilik Darjah
            </button>
            <button
              onClick={() => onTeleport('kantin')}
              className="px-2.5 py-1 text-xs rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Kantin
            </button>
            <button
              onClick={() => onTeleport('perpustakaan')}
              className="px-2.5 py-1 text-xs rounded-lg font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Perpustakaan
            </button>
          </div>

          {/* Desktop Controls Hint */}
          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
            <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">
              W, A, S, D
            </span>
            <span>Bergerak</span>
            <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-mono">
              E / Ketuk
            </span>
            <span>Periksa Objek</span>
          </div>
        </div>
      </div>
    </div>
  );
};
