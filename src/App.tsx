import React, { useState, useEffect, useRef } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { MobileControls } from './components/MobileControls';
import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { TaskModal } from './components/TaskModal';
import { EvidenceNotebookModal } from './components/EvidenceNotebookModal';
import { EvidenceBoardModal } from './components/EvidenceBoardModal';
import { TutorialModal } from './components/TutorialModal';
import { AccessibilitySettingsModal } from './components/AccessibilitySettingsModal';
import { TeacherLoginModal } from './components/TeacherDashboard/TeacherLoginModal';
import { TeacherDashboard } from './components/TeacherDashboard/TeacherDashboard';
import { SchoolGameEngine, InteractiveSpot } from './game3d/GameEngine';
import {
  MissionId,
  ClueItem,
  TaskItem,
  LearnerProfile,
  AccessibilitySettings
} from './types/game';
import {
  STORY_CLUES,
  CLASSROOM_TASKS,
  CANTEEN_TASKS,
  LIBRARY_TASKS
} from './data/assessmentBank';
import {
  createGameSession,
  updateSessionProgress,
  getCurrentTeacher
} from './services/supabase';
import { soundEffects } from './services/soundEffects';

export function App() {
  // Engine instance ref
  const engineRef = useRef<SchoolGameEngine | null>(null);

  // Game Progress State
  const [currentMission, setCurrentMission] = useState<MissionId>('bilik_darjah');
  const [unlockedMissions, setUnlockedMissions] = useState<Set<MissionId>>(
    new Set(['tutorial', 'bilik_darjah'])
  );
  const [collectedClues, setCollectedClues] = useState<ClueItem[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());

  // Active Session & Learner
  const [sessionId, setSessionId] = useState<string>('session-' + Date.now());
  const [activeLearner, setActiveLearner] = useState<LearnerProfile | null>(null);

  // Interactive Spot
  const [activeSpot, setActiveSpot] = useState<InteractiveSpot | null>(null);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [taskAssociatedClue, setTaskAssociatedClue] = useState<ClueItem | undefined>(undefined);

  // UI Modal Flags
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isEvidenceBoardOpen, setIsEvidenceBoardOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTeacherLoginOpen, setIsTeacherLoginOpen] = useState(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState(false);

  // Accessibility & Audio
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    soundEnabled: true,
    volume: 0.5,
    reducedMotion: false,
    highContrast: false
  });

  // Companion Mascot "Si Kancil" dialogue message
  const [companionMessage, setCompanionMessage] = useState(
    'Selamat datang, Detektif Cilik! Mari kita cari petunjuk pertama di Bilik Darjah!'
  );

  // Initialize session on mount
  useEffect(() => {
    async function init() {
      // Check if user is logged in
      const teacher = await getCurrentTeacher();
      if (teacher) {
        // Can auto-create a session
      }
    }
    init();
  }, []);

  // Sync volume with soundEffects service
  useEffect(() => {
    soundEffects.setMuted(isSoundMuted);
    soundEffects.setVolume(accessibilitySettings.volume);
  }, [isSoundMuted, accessibilitySettings.volume]);

  // Handle Interactive Spot Encounter
  const handleSpotChanged = (spot: InteractiveSpot | null) => {
    setActiveSpot(spot);
  };

  // Trigger Interaction (from E key, HUD button, or Mobile action button)
  const handleInteractTriggered = (spot: InteractiveSpot) => {
    if (spot.type === 'door') {
      // Doorway interaction: teleport into the designated room
      if (spot.targetRoom === 'Bilik Darjah') {
        engineRef.current?.teleportToRoom('bilik_darjah');
        setCompanionMessage('Kita sudah sampai di Bilik Darjah! Periksa meja murid dan meja guru.');
      } else if (spot.targetRoom === 'Kantin') {
        engineRef.current?.teleportToRoom('kantin');
        setCompanionMessage('Ini kawasan Kantin! Cuba siasat dulang makanan dan saksi di meja.');
      } else if (spot.targetRoom === 'Perpustakaan') {
        engineRef.current?.teleportToRoom('perpustakaan');
        setCompanionMessage('Kita di Perpustakaan! Periksa rak buku dan cari Kotak Biru!');
      }
      return;
    }

    // Task spot interaction
    let taskToOpen: TaskItem | undefined;
    let clueToAward: ClueItem | undefined;

    if (spot.targetTaskId?.startsWith('task-bd')) {
      taskToOpen = CLASSROOM_TASKS.find((t) => t.id === spot.targetTaskId);
      // If completing the 3rd task, award Clue 1
      if (spot.targetTaskId === 'task-bd-3' || completedTaskIds.has('task-bd-1')) {
        clueToAward = STORY_CLUES[0];
      }
    } else if (spot.targetTaskId?.startsWith('task-kn')) {
      taskToOpen = CANTEEN_TASKS.find((t) => t.id === spot.targetTaskId);
      if (spot.targetTaskId === 'task-kn-3' || completedTaskIds.has('task-kn-2')) {
        clueToAward = STORY_CLUES[1];
      }
    } else if (spot.targetTaskId?.startsWith('task-pp')) {
      taskToOpen = LIBRARY_TASKS.find((t) => t.id === spot.targetTaskId);
      if (spot.targetTaskId === 'task-pp-3') {
        clueToAward = STORY_CLUES[2];
      }
    }

    if (taskToOpen) {
      setActiveTask(taskToOpen);
      setTaskAssociatedClue(clueToAward);
    }
  };

  // Called when a task in TaskModal is successfully finished
  const handleTaskCompleted = async (clueAwarded?: ClueItem) => {
    if (activeTask) {
      const updatedCompleted = new Set(completedTaskIds);
      updatedCompleted.add(activeTask.id);
      setCompletedTaskIds(updatedCompleted);

      // Check for Clue Award
      if (clueAwarded && !collectedClues.some((c) => c.id === clueAwarded.id)) {
        const nextClues = [...collectedClues, clueAwarded];
        setCollectedClues(nextClues);

        // Update companion and unlocked mission
        if (clueAwarded.id === 'clue-1') {
          setCurrentMission('kantin');
          setUnlockedMissions((prev) => new Set([...prev, 'kantin']));
          setCompanionMessage('Bagus! Kamu jumpa Petunjuk 1. Sekarang jalan ke Kantin untuk mencari jejak Ali.');
        } else if (clueAwarded.id === 'clue-2') {
          setCurrentMission('perpustakaan');
          setUnlockedMissions((prev) => new Set([...prev, 'perpustakaan']));
          setCompanionMessage('Petunjuk 2 berjaya dirungkai! Ali menuju ke Perpustakaan. Jom ke sana!');
        } else if (clueAwarded.id === 'clue-3') {
          setCurrentMission('papan_bukti');
          setUnlockedMissions((prev) => new Set([...prev, 'papan_bukti']));
          setCompanionMessage('Hebat! Semua 3 petunjuk lengkap! Buka Papan Bukti untuk sahkan lokasi Kotak Biru!');
        }

        // Persist progress to Supabase
        try {
          await updateSessionProgress(sessionId, {
            current_mission: clueAwarded.missionId
          });
        } catch (e) {
          // offline mode
        }
      }
    }

    setActiveTask(null);
    setTaskAssociatedClue(undefined);
  };

  // Teleport handler from HUD
  const handleTeleport = (room: 'hallway' | 'bilik_darjah' | 'kantin' | 'perpustakaan') => {
    engineRef.current?.teleportToRoom(room);
    if (room === 'hallway') setCompanionMessage('Kamu kini berada di Lorong Sekolah.');
    if (room === 'bilik_darjah') setCompanionMessage('Kamu tiba di Bilik Darjah.');
    if (room === 'kantin') setCompanionMessage('Kamu tiba di Kantin Sekolah.');
    if (room === 'perpustakaan') setCompanionMessage('Kamu tiba di Perpustakaan Sekolah.');
  };

  // Start new exploration from Main Menu
  const handleStartNewMission = async () => {
    setIsMenuOpen(false);
    setCurrentMission('bilik_darjah');
    setUnlockedMissions(new Set(['tutorial', 'bilik_darjah']));
    setCollectedClues([]);
    setCompletedTaskIds(new Set());
    engineRef.current?.teleportToRoom('hallway');
    setCompanionMessage('Misi bermula! Berjalan ke hadapan dan masuki Bilik Darjah di sebelah kiri.');

    if (activeLearner) {
      try {
        const newSession = await createGameSession(activeLearner.id, 'intervention');
        setSessionId(newSession.id);
      } catch (e) {
        console.warn('Session created offline', e);
      }
    }
  };

  const handleContinueMission = () => {
    setIsMenuOpen(false);
    soundEffects.playInteract();
  };

  // Mystery Solved Celebration
  const handleMysterySolved = async () => {
    setCompanionMessage('Tahniah Detektif Cilik! Misteri Kotak Hilang telah berjaya diselesaikan sepenuhnya!');
    try {
      await updateSessionProgress(sessionId, {
        status: 'completed',
        completed_at: new Date().toISOString()
      });
    } catch (e) {
      // offline
    }
  };

  // Font size CSS class helper for accessibility
  const getFontSizeClass = () => {
    if (accessibilitySettings.fontSize === 'large') return 'text-lg';
    if (accessibilitySettings.fontSize === 'extra-large') return 'text-xl';
    return 'text-base';
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-slate-950 font-sans ${getFontSizeClass()} ${
        accessibilitySettings.highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* 3D WebGL Canvas Layer */}
      <GameCanvas
        onEngineReady={(engine) => {
          engineRef.current = engine;
        }}
        onSpotChanged={handleSpotChanged}
        onInteractTriggered={handleInteractTriggered}
        unlockedMissions={unlockedMissions}
      />

      {/* Mobile Virtual Joystick & Touch Controls */}
      <MobileControls
        onMoveVector={(vector) => {
          if (engineRef.current) {
            engineRef.current.inputVector = vector;
          }
        }}
        onAction={() => {
          if (engineRef.current) {
            engineRef.current.triggerInteraction();
          }
        }}
        hasActiveSpot={Boolean(activeSpot)}
        actionLabel={activeSpot ? 'PERIKSA (E)' : 'TEROKA'}
      />

      {/* In-Game HUD (Collapsible Dock, Status, Companion) */}
      {!isMenuOpen && !isTeacherDashboardOpen && (
        <HUD
          currentMission={currentMission}
          clues={collectedClues}
          activeSpot={activeSpot}
          onOpenNotebook={() => setIsNotebookOpen(true)}
          onOpenEvidenceBoard={() => setIsEvidenceBoardOpen(true)}
          onOpenTeacherPortal={() => setIsTeacherLoginOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onTeleport={handleTeleport}
          onInteract={() => {
            engineRef.current?.triggerInteraction();
          }}
          isSoundMuted={isSoundMuted}
          onToggleSound={() => setIsSoundMuted(!isSoundMuted)}
          companionMessage={companionMessage}
        />
      )}

      {/* Main Menu Modal */}
      {isMenuOpen && (
        <MainMenu
          hasExistingSession={collectedClues.length > 0}
          onStartNewMission={handleStartNewMission}
          onContinueMission={handleContinueMission}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenTeacherPortal={() => setIsTeacherLoginOpen(true)}
          learnerCode={activeLearner?.learner_code}
        />
      )}

      {/* Task Modal (4-Tier Scaffolding Learning Activity) */}
      {activeTask && (
        <TaskModal
          task={activeTask}
          sessionId={sessionId}
          learnerId={activeLearner?.id || 'demo-learner-1'}
          onClose={() => {
            setActiveTask(null);
            setTaskAssociatedClue(undefined);
          }}
          onTaskCompleted={handleTaskCompleted}
          associatedClue={taskAssociatedClue}
        />
      )}

      {/* Evidence Notebook Modal */}
      {isNotebookOpen && (
        <EvidenceNotebookModal
          collectedClues={collectedClues}
          onClose={() => setIsNotebookOpen(false)}
          onOpenEvidenceBoard={() => {
            setIsNotebookOpen(false);
            setIsEvidenceBoardOpen(true);
          }}
        />
      )}

      {/* Evidence Board Final Deduction Modal */}
      {isEvidenceBoardOpen && (
        <EvidenceBoardModal
          collectedClues={collectedClues}
          onClose={() => setIsEvidenceBoardOpen(false)}
          onMysterySolved={handleMysterySolved}
        />
      )}

      {/* Tutorial Modal */}
      {isTutorialOpen && (
        <TutorialModal
          onClose={() => setIsTutorialOpen(false)}
          onStartExploration={() => {
            setIsTutorialOpen(false);
            if (isMenuOpen) {
              handleStartNewMission();
            }
          }}
        />
      )}

      {/* Accessibility Settings Modal */}
      {isSettingsOpen && (
        <AccessibilitySettingsModal
          settings={accessibilitySettings}
          onUpdateSettings={setAccessibilitySettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Teacher Login Modal */}
      {isTeacherLoginOpen && (
        <TeacherLoginModal
          onLoginSuccess={() => {
            setIsTeacherLoginOpen(false);
            setIsTeacherDashboardOpen(true);
          }}
          onClose={() => setIsTeacherLoginOpen(false)}
        />
      )}

      {/* Teacher Dashboard Fullscreen */}
      {isTeacherDashboardOpen && (
        <TeacherDashboard
          onBackToGame={() => setIsTeacherDashboardOpen(false)}
          onLogout={() => {
            setIsTeacherDashboardOpen(false);
            setIsTeacherLoginOpen(false);
          }}
          initialLearner={activeLearner}
          onSelectLearner={(learner) => setActiveLearner(learner)}
        />
      )}
    </div>
  );
}

export default App;
