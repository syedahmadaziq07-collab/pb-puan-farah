import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Lightbulb,
  Layers,
  BookOpen
} from 'lucide-react';
import { TaskItem, ChoiceOption, AssistanceLevel, ClueItem } from '../types/game';
import { soundEffects } from '../services/soundEffects';
import { recordTaskResponse } from '../services/supabase';

interface TaskModalProps {
  task: TaskItem;
  sessionId: string;
  learnerId: string;
  onClose: () => void;
  onTaskCompleted: (clueAwarded?: ClueItem) => void;
  associatedClue?: ClueItem;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  sessionId,
  learnerId,
  onClose,
  onTaskCompleted,
  associatedClue
}) => {
  // Scaffolding Level: 0 (Independent), 1 (Visual highlight), 2 (Segmentation), 3 (Worked example)
  const [assistanceLevel, setAssistanceLevel] = useState<AssistanceLevel>(0);
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState<boolean | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'try_again'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ordering state for sequencing tasks
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);

  const handleSelectOption = (option: ChoiceOption) => {
    if (feedbackState === 'correct') return;
    setSelectedOptionId(option.id);
  };

  const handleConfirmAnswer = async () => {
    if (!selectedOptionId || isSubmitting) return;
    setIsSubmitting(true);

    const chosen = task.options.find((opt) => opt.id === selectedOptionId);
    const isCorrect = chosen?.isCorrect ?? false;
    const currentAttempt = attemptsCount + 1;
    setAttemptsCount(currentAttempt);

    let isFirstCorrect = firstAttemptCorrect;
    if (currentAttempt === 1) {
      isFirstCorrect = isCorrect && assistanceLevel === 0;
      setFirstAttemptCorrect(isFirstCorrect);
    }

    if (isCorrect) {
      soundEffects.playSuccess();
      setFeedbackState('correct');
      setFeedbackMessage(
        assistanceLevel === 0
          ? 'Tahniah! Jawapan kamu tepat secara berdikari!'
          : 'Bagus! Kamu berjaya menjawab dengan bantuan bimbingan.'
      );

      // Record to Supabase
      try {
        await recordTaskResponse({
          session_id: sessionId,
          learner_id: learnerId,
          task_id: task.id,
          first_attempt_correct: isFirstCorrect ?? false,
          final_attempt_correct: true,
          assistance_level_used: assistanceLevel,
          attempts_count: currentAttempt,
          selected_option_id: selectedOptionId
        });
      } catch (err) {
        console.warn('Response saved in offline draft mode', err);
      }
    } else {
      soundEffects.playTryAgain();
      setFeedbackState('try_again');
      setFeedbackMessage('Usaha yang baik! Cuba baca semula ayat di atas, atau minta bantuan petunjuk.');

      // Automatically offer scaffolding recommendation if struggling
      if (assistanceLevel < 3) {
        // Can advance scaffolding
      }
    }
    setIsSubmitting(false);
  };

  const handleRequestNextScaffold = () => {
    if (assistanceLevel < 3) {
      const nextLevel = (assistanceLevel + 1) as AssistanceLevel;
      setAssistanceLevel(nextLevel);
      setFeedbackState('idle');
      soundEffects.playInteract();
    }
  };

  const handleFinishAndCollectClue = () => {
    if (associatedClue) {
      soundEffects.playClueFound();
    }
    onTaskCompleted(associatedClue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-2xl w-full p-5 md:p-6 shadow-2xl text-white flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Siasatan: {task.interactionObjectName}
              </span>
              <span className="text-[11px] text-slate-400">
                Tahap Bantuan: {assistanceLevel === 0 ? 'Berdikari' : `Tahap ${assistanceLevel}`}
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-black mt-1 text-slate-100">
              {task.promptText}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* ---------------- SCAFFOLDING TIER DISPLAY ---------------- */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Baca dan Fahami Ayat:
            </span>

            {/* Assistance Level Badges */}
            <div className="flex items-center gap-1 text-[10px]">
              <span
                className={`px-2 py-0.5 rounded font-bold ${
                  assistanceLevel === 0
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                0: Berdikari
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${
                  assistanceLevel === 1
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                1: Sorotan
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${
                  assistanceLevel === 2
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                2: Frasa
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${
                  assistanceLevel === 3
                    ? 'bg-teal-500 text-slate-950'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                3: Contoh
              </span>
            </div>
          </div>

          {/* Level 0: Pure Sentence */}
          {assistanceLevel === 0 && (
            <p className="text-lg md:text-xl font-extrabold text-amber-200 tracking-wide text-center py-2">
              "{task.targetSentence}"
            </p>
          )}

          {/* Level 1: Visual Highlighting */}
          {assistanceLevel === 1 && (
            <div className="text-center py-2">
              <p className="text-lg md:text-xl font-extrabold text-slate-100">
                {task.targetSentence.split(' ').map((word, i) => {
                  const isHighlighted = task.highlightWords.some((hw) =>
                    hw.toLowerCase().includes(word.toLowerCase().replace(/[^a-zA-Z]/g, ''))
                  );
                  return (
                    <span
                      key={i}
                      className={
                        isHighlighted
                          ? 'text-amber-400 bg-amber-400/20 px-1 py-0.5 rounded font-black underline underline-offset-4 mx-0.5'
                          : 'mx-0.5'
                      }
                    >
                      {word}{' '}
                    </span>
                  );
                })}
              </p>
              <span className="text-xs text-amber-300 font-semibold mt-1 block">
                💡 Perhatikan perkataan yang disorot dengan warna kuning!
              </span>
            </div>
          )}

          {/* Level 2: Sentence Segmentation */}
          {assistanceLevel === 2 && (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {task.segmentedPhrases.map((phrase, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-900/60 border border-indigo-400 text-indigo-100 px-3 py-1.5 rounded-xl text-base md:text-lg font-bold shadow"
                  >
                    {phrase}
                  </span>
                ))}
              </div>
              <span className="text-xs text-indigo-300 font-semibold">
                🧩 Ayat dipecahkan kepada bahagian kecil agar mudah difahami.
              </span>
            </div>
          )}

          {/* Level 3: Worked Example */}
          {assistanceLevel === 3 && (
            <div className="bg-slate-900/90 border border-teal-500/50 rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold">
                <Lightbulb className="w-4 h-4" />
                <span>Contoh Berpandu (Worked Example):</span>
              </div>
              <p className="text-sm text-teal-100 font-medium">
                {task.workedExample.exampleSentence}
              </p>
              <p className="text-xs text-slate-300">
                {task.workedExample.explanation}
              </p>
              <div className="text-[11px] bg-teal-950/60 text-teal-200 px-2 py-1 rounded border border-teal-800">
                🔍 {task.workedExample.visualClue}
              </div>
            </div>
          )}
        </div>

        {/* ---------------- CHOICE OPTIONS ---------------- */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-300">
            Pilih gambar atau huraian yang sepadan dengan ayat di atas:
          </span>

          <div className="grid grid-cols-1 gap-2.5">
            {task.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  disabled={feedbackState === 'correct'}
                  onClick={() => handleSelectOption(opt)}
                  className={`text-left p-3.5 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500/15 shadow-md scale-[1.01]'
                      : 'border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400 text-slate-950'
                        : 'border-slate-500 text-slate-400'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </div>
                  <div className="flex-1">
                    <span className="font-extrabold text-sm md:text-base text-slate-100 block">
                      {opt.label}
                    </span>
                    <span className="text-xs text-slate-400 font-medium leading-relaxed block mt-0.5">
                      {opt.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------------- FEEDBACK BANNER ---------------- */}
        {feedbackState !== 'idle' && (
          <div
            className={`p-3 rounded-2xl border flex items-start gap-2.5 animate-in fade-in ${
              feedbackState === 'correct'
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100'
                : 'bg-amber-950/70 border-amber-500 text-amber-100'
            }`}
          >
            {feedbackState === 'correct' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-bold text-sm block">{feedbackMessage}</span>
              {associatedClue && feedbackState === 'correct' && (
                <div className="mt-2 p-2 bg-amber-400/20 border border-amber-400/40 rounded-xl text-xs text-amber-200">
                  🎉 <strong>Petunjuk Ditemui:</strong> "{associatedClue.sentence}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- FOOTER CONTROLS ---------------- */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
          {/* Scaffolding Request Button */}
          {assistanceLevel < 3 && feedbackState !== 'correct' ? (
            <button
              onClick={handleRequestNextScaffold}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Minta Bantuan (Tahap {assistanceLevel + 1})</span>
            </button>
          ) : (
            <div />
          )}

          {/* Action Button: Confirm or Complete */}
          {feedbackState === 'correct' ? (
            <button
              onClick={handleFinishAndCollectClue}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg transition-transform active:scale-95"
            >
              <span>Simpan ke Buku Nota</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={!selectedOptionId || isSubmitting}
              onClick={handleConfirmAnswer}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all ${
                selectedOptionId && !isSubmitting
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md active:scale-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <span>Sahkan Jawapan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
