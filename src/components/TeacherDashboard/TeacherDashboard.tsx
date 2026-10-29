import React, { useState, useEffect } from 'react';
import {
  Users,
  ClipboardCheck,
  BookMarked,
  BarChart3,
  Brain,
  LogOut,
  ArrowLeft,
  CloudCheck,
  CloudOff,
  UserCheck
} from 'lucide-react';
import { LearnerManagement } from './LearnerManagement';
import { AssessmentRunner } from './AssessmentRunner';
import { OralReadingForm } from './OralReadingForm';
import { ProgressAnalytics } from './ProgressAnalytics';
import { PedagogicalMapping } from './PedagogicalMapping';
import {
  LearnerProfile,
  GameSession,
  AssessmentResult,
  TaskResponse,
  OralReadingObservation
} from '../../types/game';
import {
  getLearnerProfiles,
  getGameSessions,
  getAssessmentResults,
  getTaskResponses,
  getOralReadingObservations,
  signOutTeacher,
  getCurrentTeacher,
  isSupabaseConfigured
} from '../../services/supabase';
import { soundEffects } from '../../services/soundEffects';

interface TeacherDashboardProps {
  onBackToGame: () => void;
  onLogout: () => void;
  initialLearner?: LearnerProfile | null;
  onSelectLearner: (learner: LearnerProfile) => void;
}

type TabType = 'learners' | 'assessment' | 'oral_reading' | 'analytics' | 'pedagogy';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onBackToGame,
  onLogout,
  initialLearner,
  onSelectLearner
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('learners');
  const [learners, setLearners] = useState<LearnerProfile[]>([]);
  const [selectedLearner, setSelectedLearner] = useState<LearnerProfile | null>(initialLearner || null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [taskResponses, setTaskResponses] = useState<TaskResponse[]>([]);
  const [oralObservations, setOralObservations] = useState<OralReadingObservation[]>([]);
  const [teacherEmail, setTeacherEmail] = useState<string>('guru@sekolah.edu.my');

  const refreshAllData = async () => {
    try {
      const user = await getCurrentTeacher();
      if (user?.email) setTeacherEmail(user.email);

      const profiles = await getLearnerProfiles();
      setLearners(profiles);
      if (!selectedLearner && profiles.length > 0) {
        setSelectedLearner(profiles[0]);
        onSelectLearner(profiles[0]);
      }

      const allSessions = await getGameSessions();
      setSessions(allSessions);

      const allAssessments = await getAssessmentResults();
      setAssessments(allAssessments);

      const allResponses = await getTaskResponses();
      setTaskResponses(allResponses);

      const allObs = await getOralReadingObservations();
      setOralObservations(allObs);
    } catch (err) {
      console.warn('Dashboard loaded offline data', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleSelectLearnerProfile = (learner: LearnerProfile) => {
    setSelectedLearner(learner);
    onSelectLearner(learner);
    soundEffects.playInteract();
  };

  const handleLogout = async () => {
    await signOutTeacher();
    soundEffects.playInteract();
    onLogout();
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950 text-white flex flex-col overflow-y-auto">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-10 bg-slate-900/95 border-b border-slate-800 px-4 md:px-8 py-3.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGame}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke 3D</span>
          </button>
          <div>
            <h1 className="text-base font-black text-white">
              Portal Guru HPPK 2 — Detektif Cilik 3D
            </h1>
            <span className="text-[11px] text-slate-400">
              Guru: {teacherEmail}
            </span>
          </div>
        </div>

        {/* Database Status & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-[11px]">
            {isSupabaseConfigured ? (
              <>
                <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Supabase PostgreSQL</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 font-bold">Mod Demo / Luar Talian</span>
              </>
            )}
          </div>

          {selectedLearner && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-teal-950/80 border border-teal-500/40 rounded-full text-xs font-mono font-bold text-teal-300">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{selectedLearner.learner_code}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-red-950/70 hover:border-red-600/60 text-slate-300 hover:text-red-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Keluar</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 flex overflow-x-auto gap-2 py-2">
        {[
          { id: 'learners', label: '1. Pengurusan Murid', icon: <Users className="w-4 h-4" /> },
          { id: 'assessment', label: '2. Penilaian HPPK 2', icon: <ClipboardCheck className="w-4 h-4" /> },
          { id: 'oral_reading', label: '3. Bacaan Lisan', icon: <BookMarked className="w-4 h-4" /> },
          { id: 'analytics', label: '4. Analisis & Laporan', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'pedagogy', label: '5. Pemetaan Pedagogi', icon: <Brain className="w-4 h-4" /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                soundEffects.playInteract();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Tab Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'learners' && (
          <LearnerManagement
            learners={learners}
            activeLearner={selectedLearner}
            onSelectLearner={handleSelectLearnerProfile}
            onRefreshLearners={refreshAllData}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentRunner
            activeLearner={selectedLearner}
            onAssessmentSaved={refreshAllData}
          />
        )}

        {activeTab === 'oral_reading' && (
          <OralReadingForm
            activeLearner={selectedLearner}
            pastObservations={
              selectedLearner
                ? oralObservations.filter((o) => o.learner_id === selectedLearner.id)
                : []
            }
            onObservationSaved={refreshAllData}
          />
        )}

        {activeTab === 'analytics' && (
          <ProgressAnalytics
            activeLearner={selectedLearner}
            sessions={sessions}
            assessments={assessments}
            taskResponses={taskResponses}
          />
        )}

        {activeTab === 'pedagogy' && <PedagogicalMapping />}
      </main>
    </div>
  );
};
