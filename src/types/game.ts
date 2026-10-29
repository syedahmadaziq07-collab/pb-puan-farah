export type AssistanceLevel = 0 | 1 | 2 | 3;
// 0: Independent (Berdikari)
// 1: Visual Highlighting (Sorotan Visual)
// 2: Sentence Segmentation (Pecahan Frasa)
// 3: Worked Example (Contoh Berpandu)

export type MissionId = 'tutorial' | 'bilik_darjah' | 'kantin' | 'perpustakaan' | 'papan_bukti';

export interface ClueItem {
  id: string;
  missionId: MissionId;
  title: string;
  sentence: string;
  locationName: string;
  foundAt: string;
  iconName: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  description: string;
  isCorrect: boolean;
  visualDetail?: {
    type: 'desk' | 'shelf' | 'canteen' | 'box' | 'chair';
    color: string;
    subObject: string;
    relation: 'atas' | 'bawah' | 'sebelah' | 'dalam';
  };
}

export interface TaskItem {
  id: string;
  missionId: MissionId;
  promptText: string;
  targetSentence: string;
  highlightWords: string[];
  segmentedPhrases: string[];
  workedExample: {
    exampleSentence: string;
    explanation: string;
    visualClue: string;
  };
  options: ChoiceOption[];
  learningObjective: string;
  interactionObjectName: string;
  sequencingItems?: { id: string; text: string; correctOrder: number }[];
}

export interface AssessmentItem {
  id: string;
  code: string; // e.g., 'BASE-01', 'POST-01'
  targetSkill: string;
  difficulty: 'Asas' | 'Sederhana' | 'Pengukuhan';
  sentence: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    visualType?: string;
  }[];
  explanation: string;
}

export interface LearnerProfile {
  id: string;
  teacher_id: string;
  learner_code: string; // Pseudonymous code (e.g. MBPK-01)
  category: string; // e.g. Masalah Pembelajaran
  current_level: number; // 1, 2, or 3
  created_at: string;
  notes?: string;
}

export interface GameSession {
  id: string;
  learner_id: string;
  teacher_id: string;
  session_type: 'baseline' | 'intervention' | 'post_intervention';
  current_mission: MissionId;
  status: 'in_progress' | 'completed';
  started_at: string;
  completed_at?: string;
  total_hints_used: number;
  highest_assistance_level: AssistanceLevel;
}

export interface TaskResponse {
  id: string;
  session_id: string;
  learner_id: string;
  task_id: string;
  first_attempt_correct: boolean;
  final_attempt_correct: boolean;
  assistance_level_used: AssistanceLevel;
  attempts_count: number;
  selected_option_id: string;
  created_at: string;
}

export interface AssessmentResult {
  id: string;
  session_id: string;
  learner_id: string;
  assessment_type: 'baseline' | 'post_intervention';
  total_items: number;
  independent_correct_count: number;
  assisted_correct_count: number;
  incorrect_count: number;
  percentage: number;
  created_at: string;
  item_details: {
    item_id: string;
    selected_option_id: string;
    is_first_attempt_correct: boolean;
    assistance_level: AssistanceLevel;
  }[];
}

export interface OralReadingObservation {
  id: string;
  learner_id: string;
  teacher_id: string;
  session_date: string;
  passage_title: string;
  total_words_presented: number;
  words_read_correctly: number;
  accuracy_percentage: number;
  assistance_level: AssistanceLevel;
  errors_omission: number; // Tinggal perkataan
  errors_substitution: number; // Ganti perkataan
  errors_mispronunciation: number; // Sebutan salah
  errors_hesitation: number; // Teragak-agak
  teacher_notes: string;
  created_at: string;
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'extra-large';
  soundEnabled: boolean;
  volume: number;
  reducedMotion: boolean;
  highContrast: boolean;
}
