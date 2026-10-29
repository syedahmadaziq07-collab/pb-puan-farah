import React from 'react';
import { Settings, Volume2, Type, Eye, Sparkles } from 'lucide-react';
import { AccessibilitySettings } from '../types/game';
import { soundEffects } from '../services/soundEffects';

interface AccessibilitySettingsModalProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
  onClose: () => void;
}

export const AccessibilitySettingsModal: React.FC<AccessibilitySettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
  const handleFontSizeChange = (size: 'normal' | 'large' | 'extra-large') => {
    onUpdateSettings({ ...settings, fontSize: size });
    soundEffects.playInteract();
  };

  const handleVolumeChange = (vol: number) => {
    soundEffects.setVolume(vol);
    onUpdateSettings({ ...settings, volume: vol });
  };

  const handleReducedMotionToggle = () => {
    onUpdateSettings({ ...settings, reducedMotion: !settings.reducedMotion });
    soundEffects.playInteract();
  };

  const handleHighContrastToggle = () => {
    onUpdateSettings({ ...settings, highContrast: !settings.highContrast });
    soundEffects.playInteract();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-md w-full p-5 md:p-6 shadow-2xl text-white flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-100">
                Tetapan Kebolehcapaian
              </h2>
              <span className="text-xs text-slate-400">
                Sesuai untuk Murid Berkeperluan Pendidikan Khas
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* 1. Font Size Options */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-teal-400" />
            Saiz Tulisan Teks:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'normal', label: 'Biasa' },
              { id: 'large', label: 'Besar' },
              { id: 'extra-large', label: 'Sangat Besar' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => handleFontSizeChange(s.id as any)}
                className={`py-2 px-3 rounded-xl border-2 font-bold text-xs transition-all ${
                  settings.fontSize === s.id
                    ? 'bg-teal-600 text-white border-teal-300 shadow'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Sound Volume Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-teal-400" />
              Kelantangan Bunyi:
            </label>
            <span className="text-xs font-mono text-teal-300">
              {Math.round(settings.volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
          />
        </div>

        {/* 3. Reduced Motion */}
        <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80">
          <div>
            <span className="text-xs font-bold text-slate-200 block">
              Kurangkan Pergerakan (Reduced Motion)
            </span>
            <span className="text-[11px] text-slate-400">
              Mengurangkan kesan visual berayun untuk keselesaan sensori.
            </span>
          </div>
          <button
            onClick={handleReducedMotionToggle}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border ${
              settings.reducedMotion
                ? 'bg-teal-500 border-teal-300'
                : 'bg-slate-700 border-slate-600'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* 4. High Contrast */}
        <div className="flex items-center justify-between p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80">
          <div>
            <span className="text-xs font-bold text-slate-200 block">
              Mod Garisan Kontras Tinggi
            </span>
            <span className="text-[11px] text-slate-400">
              Menyerlahkan sempadan objek dan kad jawapan.
            </span>
          </div>
          <button
            onClick={handleHighContrastToggle}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border ${
              settings.highContrast
                ? 'bg-teal-500 border-teal-300'
                : 'bg-slate-700 border-slate-600'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Close Button */}
        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow transition-transform active:scale-95"
          >
            Simpan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
