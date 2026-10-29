import React, { useState } from 'react';
import { UserPlus, Users, Trash2, Check, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { LearnerProfile } from '../../types/game';
import { createLearnerProfile, deleteLearnerProfile } from '../../services/supabase';
import { soundEffects } from '../../services/soundEffects';

interface LearnerManagementProps {
  learners: LearnerProfile[];
  activeLearner: LearnerProfile | null;
  onSelectLearner: (learner: LearnerProfile) => void;
  onRefreshLearners: () => void;
}

export const LearnerManagement: React.FC<LearnerManagementProps> = ({
  learners,
  activeLearner,
  onSelectLearner,
  onRefreshLearners
}) => {
  const [learnerCode, setLearnerCode] = useState('');
  const [category, setCategory] = useState('Masalah Pembelajaran');
  const [level, setLevel] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!learnerCode.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const created = await createLearnerProfile(learnerCode, category, level, notes);
      soundEffects.playSuccess();
      setLearnerCode('');
      setNotes('');
      onRefreshLearners();
      onSelectLearner(created);
    } catch (err: any) {
      alert('Ralat mencipta profil: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLearnerProfile(id);
      soundEffects.playInteract();
      setDeleteConfirmId(null);
      onRefreshLearners();
    } catch (err: any) {
      alert('Ralat memadam rekod: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Privacy Notice Banner */}
      <div className="bg-teal-950/60 border border-teal-500/40 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-teal-200 block mb-0.5">
            Garis Panduan Privasi & Etika Digital (HPPK 2):
          </strong>
          Gunakan <strong>Kod Pseudonim</strong> (contoh: <code>MBPK-A01</code>). Jangan masukkan nama sebenar murid, nombor kad pengenalan, atau maklumat peribadi sensitif (PII) mengikut dasar etika penyelidikan pendidikan.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Create Profile Form */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-100 font-extrabold text-sm border-b border-slate-700 pb-2.5">
            <UserPlus className="w-4 h-4 text-teal-400" />
            <span>Daftar Murid Baharu (Pseudonim)</span>
          </div>

          <form onSubmit={handleCreateProfile} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Kod Murid (Cth: MBPK-01):
              </label>
              <input
                type="text"
                required
                value={learnerCode}
                onChange={(e) => setLearnerCode(e.target.value)}
                placeholder="MBPK-A01"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400 font-mono uppercase"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Kategori MBPK:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              >
                <option value="Masalah Pembelajaran">Masalah Pembelajaran (Fokus Utama)</option>
                <option value="Disleksia">Disleksia (Kesukaran Membaca)</option>
                <option value="Autisme Spektrum Ringan">Autisme Spektrum Ringan</option>
                <option value="ADHD / Kurang Tumpuan">ADHD / Kurang Tumpuan</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Tahap Sasaran Pembelajaran:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { lvl: 1, label: 'T1: Asas' },
                  { lvl: 2, label: 'T2: Ayat' },
                  { lvl: 3, label: 'T3: Petunjuk' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.lvl}
                    onClick={() => setLevel(item.lvl)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      level === item.lvl
                        ? 'bg-teal-600 text-white border-teal-300'
                        : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Catatan Guru (Pilihan):
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Murid memerlukan ransangan visual untuk mengecam kedudukan perabot."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !learnerCode.trim()}
              className="mt-2 w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Mendaftar...' : '+ Cipta Profil Murid'}
            </button>
          </form>
        </div>

        {/* Right: Existing Profiles List */}
        <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
            <div className="flex items-center gap-2 text-slate-100 font-extrabold text-sm">
              <Users className="w-4 h-4 text-teal-400" />
              <span>Senarai Profil Murid ({learners.length})</span>
            </div>
            {activeLearner && (
              <span className="text-[11px] font-bold text-teal-300 bg-teal-950/80 border border-teal-500/40 px-2.5 py-0.5 rounded-full">
                Murid Aktif: {activeLearner.learner_code}
              </span>
            )}
          </div>

          {learners.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs flex flex-col items-center gap-2">
              <Users className="w-8 h-8 text-slate-600" />
              <p>Belum ada profil murid berdaftar.</p>
              <p className="text-slate-500">
                Gunakan borang di sebelah kiri untuk mencipta profil murid pertama.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {learners.map((learner) => {
                const isActive = activeLearner?.id === learner.id;
                return (
                  <div
                    key={learner.id}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-3 ${
                      isActive
                        ? 'bg-slate-900 border-teal-400 shadow-md ring-1 ring-teal-400'
                        : 'bg-slate-900/60 border-slate-700/70 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black font-mono text-amber-300">
                          {learner.learner_code}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                          Tahap {learner.current_level}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        {learner.category}
                      </span>
                      {learner.notes && (
                        <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-2">
                          "{learner.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                      <button
                        onClick={() => onSelectLearner(learner)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                          isActive
                            ? 'bg-teal-500 text-slate-950 font-black'
                            : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700'
                        }`}
                      >
                        {isActive && <Check className="w-3.5 h-3.5" />}
                        <span>{isActive ? 'Aktif Dipilih' : 'Pilih Murid'}</span>
                      </button>

                      {deleteConfirmId === learner.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(learner.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold"
                          >
                            Padam
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[10px]"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(learner.id)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                          title="Padam Profil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
