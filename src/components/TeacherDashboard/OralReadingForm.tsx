import React, { useState } from 'react';
import { BookMarked, Save, Plus, History, CheckCircle2, AlertCircle } from 'lucide-react';
import { LearnerProfile, OralReadingObservation, AssistanceLevel } from '../../types/game';
import { saveOralReadingObservation } from '../../services/supabase';
import { soundEffects } from '../../services/soundEffects';

interface OralReadingFormProps {
  activeLearner: LearnerProfile | null;
  pastObservations: OralReadingObservation[];
  onObservationSaved: () => void;
}

export const OralReadingForm: React.FC<OralReadingFormProps> = ({
  activeLearner,
  pastObservations,
  onObservationSaved
}) => {
  const [passageTitle, setPassageTitle] = useState('Petikan Bacaan: Ali dan Kotak Seni');
  const [totalWords, setTotalWords] = useState<number>(20);
  const [correctWords, setCorrectWords] = useState<number>(18);
  const [assistanceLevel, setAssistanceLevel] = useState<AssistanceLevel>(0);

  const [omissions, setOmissions] = useState<number>(0);
  const [substitutions, setSubstitutions] = useState<number>(1);
  const [mispronunciations, setMispronunciations] = useState<number>(1);
  const [hesitations, setHesitations] = useState<number>(0);

  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Safe calculation: Accuracy (%) = (Correctly read words / Total words presented) * 100
  const calculateAccuracy = (correct: number, total: number): number => {
    if (!total || total <= 0) return 0;
    const clampedCorrect = Math.max(0, Math.min(correct, total));
    return Number(((clampedCorrect / total) * 100).toFixed(1));
  };

  const accuracy = calculateAccuracy(correctWords, totalWords);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLearner || isSaving) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await saveOralReadingObservation({
        learner_id: activeLearner.id,
        session_date: new Date().toISOString().split('T')[0],
        passage_title: passageTitle,
        total_words_presented: Number(totalWords),
        words_read_correctly: Number(correctWords),
        accuracy_percentage: accuracy,
        assistance_level: assistanceLevel,
        errors_omission: Number(omissions),
        errors_substitution: Number(substitutions),
        errors_mispronunciation: Number(mispronunciations),
        errors_hesitation: Number(hesitations),
        teacher_notes: notes
      });

      soundEffects.playSuccess();
      setSaveSuccess(true);
      onObservationSaved();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert('Ralat menyimpan pemerhatian: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeLearner) {
    return (
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 text-center flex flex-col items-center gap-3">
        <BookMarked className="w-10 h-10 text-teal-400" />
        <h3 className="text-base font-extrabold text-slate-100">
          Sila Pilih Profil Murid Terlebih Dahulu
        </h3>
        <p className="text-xs text-slate-400 max-w-md">
          Pilih murid di tab "Pengurusan Murid" untuk mengisi borang pemerhatian bacaan lisan mengikut rubrik HPPK 2.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
      {/* Observation Entry Form */}
      <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 flex flex-col gap-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-black text-slate-100">
              Borang Pemerhatian Bacaan Lisan Guru
            </h3>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-900 text-teal-300 px-3 py-1 rounded-full border border-slate-700">
            Murid: {activeLearner.learner_code}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Tajuk / Sumber Petikan Bacaan:
            </label>
            <input
              type="text"
              required
              value={passageTitle}
              onChange={(e) => setPassageTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Word Counts & Live Accuracy Metric */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Jumlah Perkataan:
              </label>
              <input
                type="number"
                min="1"
                required
                value={totalWords}
                onChange={(e) => setTotalWords(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Perkataan Dibaca Tepat:
              </label>
              <input
                type="number"
                min="0"
                max={totalWords}
                required
                value={correctWords}
                onChange={(e) => setCorrectWords(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-mono text-emerald-400 font-bold focus:outline-none focus:border-teal-400"
              />
            </div>

            <div className="bg-slate-900/90 rounded-xl p-2.5 border border-teal-500/40 flex flex-col justify-center items-center">
              <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">
                Ketepatan Bacaan (%)
              </span>
              <span className="text-2xl font-black text-teal-300 font-mono">
                {accuracy}%
              </span>
            </div>
          </div>

          {/* Assistance Level for Oral Reading */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Tahap Bantuan Semasa Bacaan:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { lvl: 0, label: '0: Berdikari Sepenuhnya' },
                { lvl: 1, label: '1: Bimbingan Tunjuk Baris' },
                { lvl: 2, label: '2: Segmentasi Suku Kata' },
                { lvl: 3, label: '3: Bimbingan Fonik / Sebutan' }
              ].map((b) => (
                <button
                  type="button"
                  key={b.lvl}
                  onClick={() => setAssistanceLevel(b.lvl as AssistanceLevel)}
                  className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                    assistanceLevel === b.lvl
                      ? 'bg-teal-600 text-white border-teal-300 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Observable Reading Errors (Analisis Ralat Bacaan) */}
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700/80 flex flex-col gap-2.5">
            <span className="text-xs font-extrabold text-amber-300">
              Analisis Ralat Nyata (Kekerapan Kesilapan):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Tinggal Perkataan (Omission):
                </label>
                <input
                  type="number"
                  min="0"
                  value={omissions}
                  onChange={(e) => setOmissions(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Ganti Perkataan (Substitution):
                </label>
                <input
                  type="number"
                  min="0"
                  value={substitutions}
                  onChange={(e) => setSubstitutions(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Sebutan Kurang Tepat:
                </label>
                <input
                  type="number"
                  min="0"
                  value={mispronunciations}
                  onChange={(e) => setMispronunciations(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Teragak-agak &gt; 5 saat:
                </label>
                <input
                  type="number"
                  min="0"
                  value={hesitations}
                  onChange={(e) => setHesitations(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Catatan Kualitatif Guru:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan pemerhatian tingkah laku semasa membaca, contohnya keyakinan diri, kelancaran nafas, atau keselesaan murid."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
            />
          </div>

          {saveSuccess && (
            <div className="p-2.5 bg-emerald-950/70 border border-emerald-500/50 rounded-xl flex items-center gap-2 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Rekod pemerhatian bacaan lisan berjaya disimpan!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan Rekod...' : 'Simpan Rekod Pemerhatian'}</span>
          </button>
        </form>
      </div>

      {/* Past Observations History */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center gap-2 text-slate-100 font-extrabold text-sm border-b border-slate-700 pb-2.5">
          <History className="w-4 h-4 text-teal-400" />
          <span>Sejarah Pemerhatian ({pastObservations.length})</span>
        </div>

        {pastObservations.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs flex flex-col items-center gap-2">
            <BookMarked className="w-8 h-8 text-slate-600" />
            <p>Belum ada rekod bacaan lisan bagi murid ini.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
            {pastObservations.map((obs) => (
              <div
                key={obs.id}
                className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">
                    {obs.passage_title}
                  </span>
                  <span className="text-sm font-black font-mono text-teal-300">
                    {obs.accuracy_percentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800 pt-1">
                  <span>{obs.words_read_correctly} / {obs.total_words_presented} pp</span>
                  <span>Bantuan T{obs.assistance_level}</span>
                  <span>{obs.session_date}</span>
                </div>
                {obs.teacher_notes && (
                  <p className="text-[10px] text-slate-400 italic mt-0.5 line-clamp-2">
                    "{obs.teacher_notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
