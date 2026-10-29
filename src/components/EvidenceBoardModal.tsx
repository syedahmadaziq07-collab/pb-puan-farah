import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MapPin,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClueItem } from '../types/game';
import { soundEffects } from '../services/soundEffects';

interface EvidenceBoardModalProps {
  collectedClues: ClueItem[];
  onClose: () => void;
  onMysterySolved: () => void;
}

export const EvidenceBoardModal: React.FC<EvidenceBoardModalProps> = ({
  collectedClues,
  onClose,
  onMysterySolved
}) => {
  // Step 1: Room selection (Bilik Darjah / Kantin / Perpustakaan)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  // Step 2: Specific spot selection
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  // Step 3: Justifying clue selection
  const [selectedJustification, setSelectedJustification] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleVerifyDeduction = () => {
    if (!selectedRoom || !selectedSpot || !selectedJustification) return;

    // Correct deduction:
    // Room: Perpustakaan
    // Spot: Sebelah rak buku
    // Justification: Petunjuk 3 (Kotak biru diletakkan di sebelah rak buku)
    const isRoomCorrect = selectedRoom === 'perpustakaan';
    const isSpotCorrect = selectedSpot === 'sebelah_rak';
    const isJustificationCorrect = selectedJustification === 'clue-3';

    if (isRoomCorrect && isSpotCorrect && isJustificationCorrect) {
      soundEffects.playVictory();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback if confetti fails
      }
      setIsCompleted(true);
      setFeedback({
        isCorrect: true,
        message: 'Tahniah, Detektif Cilik! Kamu berjaya menyelesaikan kes berdasarkan petunjuk yang dikumpulkan.'
      });
      onMysterySolved();
    } else {
      soundEffects.playTryAgain();
      let hint = 'Semak semula petunjuk: Ali melalui kantin dan menuju ke mana akhirnya?';
      if (!isRoomCorrect) {
        hint = 'Petunjuk 2 menyatakan Ali pergi ke perpustakaan selepas melalui kantin.';
      } else if (!isSpotCorrect) {
        hint = 'Petunjuk 3 menyebut secara jelas di mana kotak biru diletakkan.';
      }
      setFeedback({
        isCorrect: false,
        message: `Usaha yang baik! ${hint}`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl max-w-3xl w-full p-5 md:p-6 shadow-2xl text-white flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-300">
                Papan Bukti Akhir: Selesaikan Misteri
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                Penaakulan berasaskan bukti petunjuk yang dikumpulkan
              </span>
            </div>
          </div>
          {!isCompleted && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* ---------------- 3 CLUES BOARD ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {collectedClues.map((c, i) => (
            <div
              key={c.id}
              className="bg-slate-800/90 border border-amber-500/40 rounded-2xl p-3 flex flex-col gap-1 shadow"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                Petunjuk {i + 1} ({c.locationName})
              </span>
              <p className="text-xs font-bold text-slate-100 leading-snug">
                "{c.sentence}"
              </p>
            </div>
          ))}
        </div>

        {!isCompleted ? (
          <>
            {/* ---------------- QUESTION 1: ROOM ---------------- */}
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/80 flex flex-col gap-2.5">
              <span className="text-xs font-extrabold text-amber-300">
                Langkah 1: Di bilik manakah destinasi terakhir Ali membawa kotak itu?
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bilik_darjah', label: 'Bilik Darjah' },
                  { id: 'kantin', label: 'Kantin Sekolah' },
                  { id: 'perpustakaan', label: 'Perpustakaan' }
                ].map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`p-3 rounded-xl border-2 text-xs md:text-sm font-black transition-all ${
                      selectedRoom === room.id
                        ? 'bg-amber-500 text-slate-950 border-white shadow-lg'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {room.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ---------------- QUESTION 2: SPOT ---------------- */}
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/80 flex flex-col gap-2.5">
              <span className="text-xs font-extrabold text-amber-300">
                Langkah 2: Di manakah kedudukan tepat kotak biru diletakkan?
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bawah_meja', label: 'Di bawah meja guru' },
                  { id: 'sebelah_rak', label: 'Di sebelah rak buku' },
                  { id: 'atas_kaunter', label: 'Di atas kaunter makanan' }
                ].map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => setSelectedSpot(spot.id)}
                    className={`p-3 rounded-xl border-2 text-xs md:text-sm font-black transition-all ${
                      selectedSpot === spot.id
                        ? 'bg-amber-500 text-slate-950 border-white shadow-lg'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {spot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ---------------- QUESTION 3: JUSTIFICATION ---------------- */}
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/80 flex flex-col gap-2.5">
              <span className="text-xs font-extrabold text-amber-300">
                Langkah 3: Petunjuk manakah yang membuktikan kedudukan kotak itu?
              </span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'clue-1',
                    label: 'Petunjuk 1: Ali membawa kotak biru keluar dari bilik darjah.'
                  },
                  {
                    id: 'clue-2',
                    label: 'Petunjuk 2: Selepas melalui kantin, Ali pergi ke perpustakaan.'
                  },
                  {
                    id: 'clue-3',
                    label: 'Petunjuk 3: Kotak biru diletakkan di sebelah rak buku.'
                  }
                ].map((just) => (
                  <button
                    key={just.id}
                    onClick={() => setSelectedJustification(just.id)}
                    className={`p-3 rounded-xl border-2 text-xs md:text-sm text-left font-bold transition-all ${
                      selectedJustification === just.id
                        ? 'bg-amber-500 text-slate-950 border-white shadow-lg'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {just.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback alert if incorrect */}
            {feedback && !feedback.isCorrect && (
              <div className="p-3 bg-amber-950/70 border border-amber-500/60 rounded-xl flex items-center gap-2 text-amber-200 text-xs font-semibold">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Submit Deduction */}
            <div className="border-t border-slate-800 pt-3 flex justify-end">
              <button
                disabled={!selectedRoom || !selectedSpot || !selectedJustification}
                onClick={handleVerifyDeduction}
                className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${
                  selectedRoom && selectedSpot && selectedJustification
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl active:scale-95 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Sahkan Kesimpulan Detektif</span>
              </button>
            </div>
          </>
        ) : (
          /* ---------------- SUCCESS RESOLUTION SCREEN ---------------- */
          <div className="bg-slate-800/90 border-2 border-emerald-500 rounded-3xl p-6 text-center flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
              <Award className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest font-black text-emerald-400 block mb-1">
                Lencana Kejayaan Diberikan
              </span>
              <h3 className="text-2xl font-black text-white">
                Tahniah, Detektif Cilik!
              </h3>
              <p className="text-sm font-semibold text-emerald-200 mt-2 max-w-lg mx-auto">
                Kamu berjaya menyelesaikan kes berdasarkan petunjuk yang dikumpulkan!
              </p>
            </div>

            {/* Final Solution Statement strictly matching prompt specification */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-amber-400 max-w-md w-full">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 block mb-1">
                Rumusan Kes Rasmi:
              </span>
              <p className="text-base font-black text-amber-200">
                "Kotak biru berada di sebelah rak buku di perpustakaan."
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg transition-transform active:scale-95"
              >
                Kembali ke Sekolah 3D
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
