import React, { useState } from 'react';
import { GraduationCap, Lock, Mail, CloudCheck, CloudOff, AlertCircle, Sparkles } from 'lucide-react';
import { signInTeacher, signUpTeacher, isSupabaseConfigured } from '../../services/supabase';
import { soundEffects } from '../../services/soundEffects';

interface TeacherLoginModalProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  onLoginSuccess,
  onClose
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUpTeacher(email, password);
        if (error) throw new Error(error);
      } else {
        const { error } = await signInTeacher(email, password);
        if (error) throw new Error(error);
      }
      soundEffects.playSuccess();
      onLoginSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Ralat log masuk. Sila semak emel dan kata laluan.');
      soundEffects.playTryAgain();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    await signInTeacher('guru.demo@sekolah.edu.my', 'password123');
    soundEffects.playSuccess();
    setIsLoading(false);
    onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-teal-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl text-white flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-100">
                Log Masuk Portal Guru
              </h2>
              <span className="text-xs text-slate-400">
                Akses Rekod & Penilaian HPPK 2
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

        {/* Database Status Badge */}
        <div className="flex items-center justify-between p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
          <span className="text-slate-300 font-medium">Status Pangkalan Data:</span>
          {isSupabaseConfigured ? (
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CloudCheck className="w-4 h-4" />
              Supabase PostgreSQL Aktif
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <CloudOff className="w-4 h-4" />
              Mod Pratonton (Demo Mode)
            </span>
          )}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-xl flex items-center gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Emel Guru:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guru@moe-dl.edu.my"
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Kata Laluan:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-1 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? 'Memproses...' : isSignUp ? 'Daftar Akaun Guru' : 'Log Masuk'}
          </button>
        </form>

        {/* One-click Demo Teacher Login for immediate review */}
        <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Masuk Sebagai Guru Penguji (Akses Pantas)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-400 hover:text-teal-300 transition-colors text-center"
          >
            {isSignUp
              ? 'Sudah ada akaun? Log masuk di sini.'
              : 'Belum ada akaun? Daftar sebagai guru baharu.'}
          </button>
        </div>
      </div>
    </div>
  );
};
