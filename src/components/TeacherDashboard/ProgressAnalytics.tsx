import React from 'react';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { LearnerProfile, AssessmentResult, TaskResponse, GameSession } from '../../types/game';

interface ProgressAnalyticsProps {
  activeLearner: LearnerProfile | null;
  sessions: GameSession[];
  assessments: AssessmentResult[];
  taskResponses: TaskResponse[];
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({
  activeLearner,
  sessions,
  assessments,
  taskResponses
}) => {
  if (!activeLearner) {
    return (
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 text-center flex flex-col items-center gap-3">
        <BarChart3 className="w-10 h-10 text-teal-400" />
        <h3 className="text-base font-extrabold text-slate-100">
          Sila Pilih Profil Murid
        </h3>
        <p className="text-xs text-slate-400 max-w-md">
          Pilih murid di tab "Pengurusan Murid" untuk memaparkan analisis skor pra/pasca dan data tindak balas.
        </p>
      </div>
    );
  }

  // Filter assessments for active learner
  const learnerAssessments = assessments.filter((a) => a.learner_id === activeLearner.id);
  const baselineResult = learnerAssessments.find((a) => a.assessment_type === 'baseline');
  const postResult = learnerAssessments.find((a) => a.assessment_type === 'post_intervention');

  const hasBothAssessments = Boolean(baselineResult && postResult);
  const percentagePointDiff = hasBothAssessments
    ? (postResult!.percentage - baselineResult!.percentage).toFixed(1)
    : null;

  // Task response stats
  const learnerResponses = taskResponses.filter((r) => r.learner_id === activeLearner.id);
  const totalTasksAttempted = learnerResponses.length;
  const independentFirstCorrect = learnerResponses.filter((r) => r.first_attempt_correct).length;
  const assistedCorrect = learnerResponses.filter(
    (r) => !r.first_attempt_correct && r.final_attempt_correct
  ).length;

  const highestAssistanceUsed = learnerResponses.reduce(
    (max, r) => Math.max(max, r.assistance_level_used),
    0
  );

  // -------------------------------------------------------------
  // EXPORT CSV
  // -------------------------------------------------------------
  const handleExportCSV = () => {
    const headers = [
      'Kod Murid',
      'Kategori',
      'Tahap',
      'Skor Baseline (%)',
      'Skor Post-Intervention (%)',
      'Perbezaan Mata Peratus',
      'Tugasan Percubaan Bebas Betul',
      'Tugasan Dibantu Betul',
      'Tahap Bantuan Tertinggi Digunakan'
    ];

    const row = [
      activeLearner.learner_code,
      activeLearner.category,
      activeLearner.current_level,
      baselineResult ? baselineResult.percentage : 'N/A',
      postResult ? postResult.percentage : 'N/A',
      percentagePointDiff ? `${percentagePointDiff}%` : 'N/A',
      independentFirstCorrect,
      assistedCorrect,
      `Tahap ${highestAssistanceUsed}`
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_HPPK2_${activeLearner.learner_code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -------------------------------------------------------------
  // EXPORT JSON
  // -------------------------------------------------------------
  const handleExportJSON = () => {
    const data = {
      reportTitle: 'Laporan Kemajuan Murid - Detektif Cilik 3D HPPK 2',
      exportDate: new Date().toISOString(),
      learnerProfile: activeLearner,
      assessments: {
        baseline: baselineResult || null,
        postIntervention: postResult || null,
        percentagePointDifference: percentagePointDiff
      },
      taskResponses: learnerResponses,
      summaryMetrics: {
        totalTasksAttempted,
        independentFirstCorrect,
        assistedCorrect,
        highestAssistanceUsed
      }
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `Laporan_HPPK2_${activeLearner.learner_code}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Top Header & Export Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 shadow-lg">
        <div>
          <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            <span>Laporan Kemajuan & Analisis Skor HPPK 2</span>
          </h3>
          <span className="text-xs text-slate-400">
            Murid: <strong className="text-teal-300 font-mono">{activeLearner.learner_code}</strong> | Kategori: {activeLearner.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-700 text-teal-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Eksport CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Eksport JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Baseline vs Post Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Baseline Card */}
        <div className="bg-slate-800/80 border border-amber-500/40 rounded-3xl p-5 flex flex-col gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
            1. Skor Penilaian Awal (Pra)
          </span>
          {baselineResult ? (
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-white">
                {baselineResult.percentage}%
              </span>
              <span className="text-xs text-slate-400">
                ({baselineResult.independent_correct_count} / {baselineResult.total_items} item betul)
              </span>
            </div>
          ) : (
            <div className="py-3 text-xs text-slate-400 italic">
              Belum ditadbir. Sila jalankan penilaian awal di tab Penilaian.
            </div>
          )}
        </div>

        {/* Post-Intervention Card */}
        <div className="bg-slate-800/80 border border-teal-500/40 rounded-3xl p-5 flex flex-col gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-teal-400">
            2. Skor Penilaian Susulan (Pasca)
          </span>
          {postResult ? (
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-white">
                {postResult.percentage}%
              </span>
              <span className="text-xs text-slate-400">
                ({postResult.independent_correct_count} / {postResult.total_items} item betul)
              </span>
            </div>
          ) : (
            <div className="py-3 text-xs text-slate-400 italic">
              Belum ditadbir. Jalankan pasca-intervensi selepas permainan selesai.
            </div>
          )}
        </div>

        {/* Difference Card */}
        <div className="bg-slate-800/80 border border-indigo-500/40 rounded-3xl p-5 flex flex-col gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400">
            3. Perbezaan Mata Peratus
          </span>
          {hasBothAssessments ? (
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-3xl font-black font-mono ${
                  Number(percentagePointDiff) >= 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {Number(percentagePointDiff) > 0 ? `+${percentagePointDiff}` : percentagePointDiff}%
              </span>
              <span className="text-xs text-slate-400">
                mata peratus
              </span>
            </div>
          ) : (
            <div className="py-3 text-xs text-slate-400 italic">
              Memerlukan kedua-dua skor pra dan pasca untuk pengiraan.
            </div>
          )}
        </div>
      </div>

      {/* Scaffolding & Response Breakdown */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 flex flex-col gap-4">
        <h4 className="text-sm font-extrabold text-slate-200">
          Analisis Tindak Balas Tugasan Sepanjang Sesi Permainan 3D
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block">Tugasan Dicuba</span>
            <span className="text-xl font-black font-mono text-white">{totalTasksAttempted}</span>
          </div>

          <div className="bg-slate-900 p-3 rounded-2xl border border-emerald-500/40 text-center">
            <span className="text-[10px] text-emerald-300 block">Betul Berdikari (T0)</span>
            <span className="text-xl font-black font-mono text-emerald-400">{independentFirstCorrect}</span>
          </div>

          <div className="bg-slate-900 p-3 rounded-2xl border border-amber-500/40 text-center">
            <span className="text-[10px] text-amber-300 block">Betul Selepas Bimbingan</span>
            <span className="text-xl font-black font-mono text-amber-400">{assistedCorrect}</span>
          </div>

          <div className="bg-slate-900 p-3 rounded-2xl border border-indigo-500/40 text-center">
            <span className="text-[10px] text-indigo-300 block">Tahap Bantuan Tertinggi</span>
            <span className="text-xl font-black font-mono text-indigo-400">Tahap {highestAssistanceUsed}</span>
          </div>
        </div>
      </div>

      {/* Teacher Interpretation Note (Neutral, evidence-based language adhering to Section 15) */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-3xl p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Panduan Interpretasi Guru (Format Piawai HPPK 2)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {hasBothAssessments && Number(percentagePointDiff) > 0
            ? 'Ketepatan jawapan meningkat daripada sesi awal kepada sesi susulan. Semak juga tahap bantuan yang diperlukan sebelum membuat kesimpulan tentang penguasaan berdikari.'
            : hasBothAssessments
            ? 'Prestasi menunjukkan ketepatan yang stabil. Teruskan pengukuhan konsep hubungan ruang dengan bahan maujud dalam bilik darjah fizikal.'
            : 'Jalankan pentadbiran penilaian awal dan penilaian susulan untuk menjana rumusan interpretasi perbandingan prestasi murid.'}
        </p>
        <span className="text-[10px] text-slate-500 mt-1">
          * Catatan: Data ini merekodkan respons murid terhadap aktiviti kefahaman ayat dalam BBB digital ini dan tidak bertujuan sebagai diagnosis perubatan/psikometrik klinikal.
        </span>
      </div>
    </div>
  );
};
