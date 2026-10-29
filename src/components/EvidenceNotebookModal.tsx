import React from 'react';
import { BookOpen, CheckCircle2, Clock, Sparkles, MapPin, FileText, Footprints, Box } from 'lucide-react';
import { ClueItem } from '../types/game';
import { STORY_CLUES } from '../data/assessmentBank';

interface EvidenceNotebookModalProps {
  collectedClues: ClueItem[];
  onClose: () => void;
  onOpenEvidenceBoard: () => void;
}

export const EvidenceNotebookModal: React.FC<EvidenceNotebookModalProps> = ({
  collectedClues,
  onClose,
  onOpenEvidenceBoard
}) => {
  const isAllCollected = collectedClues.length >= 3;

  const getClueIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-5 h-5 text-amber-400" />;
      case 'Footprints':
        return <Footprints className="w-5 h-5 text-emerald-400" />;
      case 'Box':
        return <Box className="w-5 h-5 text-blue-400" />;
      default:
        return <FileText className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-2xl w-full p-5 md:p-6 shadow-2xl text-white flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-300">
                Buku Nota Detektif Cilik
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                Kes: Misteri Kotak Alatan Seni Hilang
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

        {/* Story Synopsis */}
        <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/80 text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-300 block mb-1">Sinopsis Kes:</strong>
          Satu kotak biru berisi alatan seni hilang di kawasan sekolah. Tugas kamu ialah mengumpulkan 3 petunjuk utama di bilik darjah, kantin, dan perpustakaan untuk merungkai lokasi sebenar kotak tersebut.
        </div>

        {/* 3 Clues List */}
        <div className="flex flex-col gap-3">
          {STORY_CLUES.map((clue, index) => {
            const isFound = collectedClues.some((c) => c.id === clue.id);
            return (
              <div
                key={clue.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 ${
                  isFound
                    ? 'bg-slate-800/90 border-amber-400/80 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getClueIcon(clue.iconName)}
                    <span className="font-extrabold text-sm md:text-base text-slate-100">
                      {clue.title}
                    </span>
                  </div>
                  {isFound ? (
                    <span className="flex items-center gap-1 text-[11px] font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Dijumpai!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                      <Clock className="w-3 h-3" />
                      Belum Ditemui
                    </span>
                  )}
                </div>

                {isFound ? (
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-700">
                    <p className="text-sm md:text-base font-bold text-amber-200">
                      "{clue.sentence}"
                    </p>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      📍 Lokasi jumpaan: {clue.foundAt} ({clue.locationName})
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Siasat objek dan persekitaran di {clue.locationName} untuk mencari petunjuk nombor {index + 1}.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer: Solve Action */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Kemajuan Petunjuk: {collectedClues.length} / 3
          </span>

          {isAllCollected ? (
            <button
              onClick={() => {
                onClose();
                onOpenEvidenceBoard();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs md:text-sm shadow-xl border border-indigo-400 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Buka Papan Bukti & Selesaikan!</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Tutup & Teruskan Siasatan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
