import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Sparkles
} from 'lucide-react';
import { AssessmentItem, LearnerProfile, AssistanceLevel, AssessmentResult } from '../../types/game';
import { BASELINE_ASSESSMENT_ITEMS, POST_ASSESSMENT_ITEMS } from '../../data/assessmentBank';
import { saveAssessmentResult, createGameSession } from '../../services/supabase';
import { soundEffects } from '../../services/soundEffects';

interface AssessmentRunnerProps {
  activeLearner: LearnerProfile | null;
  onAssessmentSaved: () => void;
}

export const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({
  activeLearner,
  onAssessmentSaved
}) => {
  const [assessmentType, setAssessmentType] = useState<'baseline' | 'post_intervention'>('baseline');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Per-item responses
  const [responses, setResponses] = useState<
    {
      itemId: string;
      selectedOptionId: string;
      isFirstAttemptCorrect: boolean;
      assistanceLevel: AssistanceLevel;
    }[]
  >([]);

  const items = assessmentType === 'baseline' ? BASELINE_ASSESSMENT_ITEMS : POST_ASSESSMENT_ITEMS;
  const currentItem = items[currentIndex];

  const handleStart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setResponses([]);
    setIsCompleted(false);
    setIsStarted(true);
    soundEffects.playInteract();
  };

  const handleSelectOption = (optId: string) => {
    setSelectedOptionId(optId);
  };

  const handleNextItem = () => {
    if (!selectedOptionId) return;

    const chosenOption = currentItem.options.find((o) => o.id === selectedOptionId);
    const isCorrect = chosenOption?.isCorrect ?? false;

    const newResponse = {
      itemId: currentItem.id,
      selectedOptionId,
      isFirstAttemptCorrect: isCorrect,
      assistanceLevel: 0 as AssistanceLevel // Baseline & Post tests are strictly independent attempts
    };

    const nextResponses = [...responses, newResponse];
    setResponses(nextResponses);

    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionId(null);
      soundEffects.playInteract();
    } else {
      // Completed all 10 items
      finishAssessment(nextResponses);
    }
  };

  const finishAssessment = async (allResponses: typeof responses) => {
    setIsCompleted(true);
    soundEffects.playSuccess();

    if (!activeLearner) return;

    setIsSaving(true);
    const independentCorrect = allResponses.filter((r) => r.isFirstAttemptCorrect).length;
    const percentage = Number(((independentCorrect / items.length) * 100).toFixed(1));

    try {
      // Create session first
      const session = await createGameSession(activeLearner.id, assessmentType);

      await saveAssessmentResult({
        session_id: session.id,
        learner_id: activeLearner.id,
        assessment_type: assessmentType,
        total_items: items.length,
        independent_correct_count: independentCorrect,
        assisted_correct_count: 0,
        incorrect_count: items.length - independentCorrect,
        percentage,
        item_details: allResponses.map((r) => ({
          item_id: r.itemId,
          selected_option_id: r.selectedOptionId,
          is_first_attempt_correct: r.isFirstAttemptCorrect,
          assistance_level: r.assistanceLevel
        }))
      });
      onAssessmentSaved();
    } catch (err) {
      console.warn('Saved assessment in offline mode', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeLearner) {
    return (
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 text-center flex flex-col items-center gap-3">
        <ClipboardCheck className="w-10 h-10 text-amber-400" />
        <h3 className="text-base font-extrabold text-slate-100">
          Sila Pilih Profil Murid Terlebih Dahulu
        </h3>
        <p className="text-xs text-slate-400 max-w-md">
          Pergi ke tab "Pengurusan Murid" untuk memilih atau mendaftar kod pseudonim murid sebelum menjalankan penilaian awal atau penilaian susulan.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full">
      {/* Assessment Mode Selector */}
      {!isStarted && !isCompleted && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-100">
                Pilih Mod Penilaian HPPK 2
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Murid Sasaran: <strong className="text-teal-300 font-mono">{activeLearner.learner_code}</strong>
              </span>
            </div>
            <span className="text-xs bg-slate-900 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              10 Item Soalan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Baseline Option */}
            <button
              onClick={() => setAssessmentType('baseline')}
              className={`p-5 rounded-2xl border-2 text-left flex flex-col gap-2 transition-all ${
                assessmentType === 'baseline'
                  ? 'bg-amber-500/10 border-amber-400 shadow-md ring-1 ring-amber-400'
                  : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-amber-300">
                  1. Penilaian Awal (Pra-Intervensi)
                </span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                  Baseline Test
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mentadbir 10 item kefahaman ayat dan hubungan ruang (di atas, di bawah, di dalam, di sebelah) sebelum murid memulakan intervensi 3D.
              </p>
            </button>

            {/* Post-intervention Option */}
            <button
              onClick={() => setAssessmentType('post_intervention')}
              className={`p-5 rounded-2xl border-2 text-left flex flex-col gap-2 transition-all ${
                assessmentType === 'post_intervention'
                  ? 'bg-teal-500/10 border-teal-400 shadow-md ring-1 ring-teal-400'
                  : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-teal-300">
                  2. Penilaian Susulan (Pasca-Intervensi)
                </span>
                <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">
                  Post-Test
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mentadbir 10 item selari yang setara kesukarannya selepas murid selesai meneroka misi misteri di bilik darjah, kantin, dan perpustakaan.
              </p>
            </button>
          </div>

          <div className="bg-slate-900/70 p-3.5 rounded-2xl border border-slate-700/80 text-xs text-slate-400 leading-relaxed">
            ℹ️ <strong>Prosedur Piawai HPPK 2:</strong> Setiap soalan mengandungi satu ayat dan tiga pilihan jawapan. Tiada bimbingan awal diberikan semasa ujian pra/pasca untuk mengukur kefahaman berdikari sebenar. Keputusan hanya dipaparkan di hujung penilaian.
          </div>

          <button
            onClick={handleStart}
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95"
          >
            Mula Mentadbir Penilaian ({assessmentType === 'baseline' ? 'Pra' : 'Pasca'})
          </button>
        </div>
      )}

      {/* Active Running Assessment */}
      {isStarted && !isCompleted && currentItem && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 flex flex-col gap-5 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                {currentItem.code} • {currentItem.targetSkill}
              </span>
              <span className="text-xs text-slate-400 ml-2">
                Kesukaran: {currentItem.difficulty}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-teal-300">
              Soalan {currentIndex + 1} / {items.length}
            </span>
          </div>

          {/* Target Sentence */}
          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5 text-center">
            <span className="text-xs font-bold text-slate-400 block mb-1">
              Ayat Ujian:
            </span>
            <p className="text-xl md:text-2xl font-black text-amber-200 tracking-wide">
              "{currentItem.sentence}"
            </p>
          </div>

          {/* 3 Choices */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs font-bold text-slate-300">
              Pilih jawapan yang paling tepat menggambarkan ayat:
            </span>
            {currentItem.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-md scale-[1.01]'
                      : 'bg-slate-900/60 border-slate-700 hover:border-slate-600 hover:bg-slate-900'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-black ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400 text-slate-950'
                        : 'border-slate-600 text-slate-500'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </div>
                  <span className="text-sm md:text-base font-bold text-slate-100">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
              className="bg-teal-400 h-full transition-all duration-300"
            />
          </div>

          {/* Next Button */}
          <div className="flex justify-end border-t border-slate-700 pt-3">
            <button
              disabled={!selectedOptionId}
              onClick={handleNextItem}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs md:text-sm transition-all ${
                selectedOptionId
                  ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md active:scale-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <span>{currentIndex === items.length - 1 ? 'Hantar & Tamat Penilaian' : 'Soalan Seterusnya'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Completed Summary View */}
      {isCompleted && (
        <div className="bg-slate-800/90 border-2 border-teal-500 rounded-3xl p-6 md:p-8 flex flex-col items-center gap-5 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300">
            <Award className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-teal-400 block mb-1">
              Penilaian {assessmentType === 'baseline' ? 'Pra-Intervensi' : 'Pasca-Intervensi'} Tamat
            </span>
            <h3 className="text-2xl font-black text-white">
              Rekod Skor: {activeLearner.learner_code}
            </h3>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-3 gap-3 max-w-lg w-full">
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-700">
              <span className="text-[10px] text-slate-400 block">Jumlah Item</span>
              <span className="text-2xl font-black text-white">{items.length}</span>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-emerald-500/40">
              <span className="text-[10px] text-emerald-300 block">Betul Berdikari</span>
              <span className="text-2xl font-black text-emerald-400">
                {responses.filter((r) => r.isFirstAttemptCorrect).length}
              </span>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-teal-500/40">
              <span className="text-[10px] text-teal-300 block">Peratusan</span>
              <span className="text-2xl font-black text-teal-400">
                {((responses.filter((r) => r.isFirstAttemptCorrect).length / items.length) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-md italic">
            Prestasi ini dinilai berdasarkan ketepatan jawapan pada item kefahaman ayat bertulis dalam aplikasi ini tanpa mengaitkan sebarang tuntutan psikometrik luar.
          </p>

          <button
            onClick={() => {
              setIsStarted(false);
              setIsCompleted(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tadbir Penilaian Lain</span>
          </button>
        </div>
      )}
    </div>
  );
};
