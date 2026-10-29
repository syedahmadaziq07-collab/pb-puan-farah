import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import {
  LearnerProfile,
  GameSession,
  TaskResponse,
  AssessmentResult,
  OralReadingObservation,
  AssistanceLevel,
  MissionId
} from '../types/game';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local in-memory / session store for development preview mode
const LOCAL_STORAGE_KEY_PROFILES = 'detektif_demo_profiles';
const LOCAL_STORAGE_KEY_SESSIONS = 'detektif_demo_sessions';
const LOCAL_STORAGE_KEY_RESPONSES = 'detektif_demo_responses';
const LOCAL_STORAGE_KEY_ASSESSMENTS = 'detektif_demo_assessments';
const LOCAL_STORAGE_KEY_OBSERVATIONS = 'detektif_demo_observations';

const DEMO_TEACHER: User = {
  id: 'demo-teacher-id-1234',
  app_metadata: {},
  user_metadata: { full_name: 'Guru Penyelaras Pendidikan Khas' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'guru.demo@sekolah.edu.my',
  role: 'authenticated'
} as User;

let localCurrentUser: User | null = null;

// Status event listener
type SaveStatus = 'idle' | 'saving' | 'saved_cloud' | 'saved_offline' | 'error';
let currentStatus: SaveStatus = isSupabaseConfigured ? 'idle' : 'saved_offline';
const statusListeners = new Set<(status: SaveStatus) => void>();

function setSaveStatus(status: SaveStatus) {
  currentStatus = status;
  statusListeners.forEach((listener) => listener(status));
}

export function subscribeToSaveStatus(callback: (status: SaveStatus) => void) {
  statusListeners.add(callback);
  callback(currentStatus);
  return () => {
    statusListeners.delete(callback);
  };
}

// -------------------------------------------------------------
// AUTHENTICATION
// -------------------------------------------------------------
export async function getCurrentTeacher(): Promise<User | null> {
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }
  return localCurrentUser;
}

export async function signInTeacher(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } else {
    // Demo Mode Teacher Authentication
    localCurrentUser = {
      ...DEMO_TEACHER,
      email: email || 'guru.demo@sekolah.edu.my'
    };
    return { user: localCurrentUser, error: null };
  }
}

export async function signUpTeacher(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { user: null, error: error.message };
    return { user: data.user, error: null };
  } else {
    localCurrentUser = { ...DEMO_TEACHER, email };
    return { user: localCurrentUser, error: null };
  }
}

export async function signOutTeacher(): Promise<void> {
  if (supabase) {
    await supabase.auth.signOut();
  }
  localCurrentUser = null;
}

// -------------------------------------------------------------
// LEARNER PROFILES
// -------------------------------------------------------------
export async function getLearnerProfiles(): Promise<LearnerProfile[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('learner_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  } else {
    const raw = sessionStorage.getItem(LOCAL_STORAGE_KEY_PROFILES);
    return raw ? JSON.parse(raw) : [];
  }
}

export async function createLearnerProfile(
  learnerCode: string,
  category: string = 'Masalah Pembelajaran',
  level: number = 1,
  notes?: string
): Promise<LearnerProfile> {
  setSaveStatus('saving');
  const teacher = await getCurrentTeacher();
  const teacherId = teacher?.id || 'demo-teacher-id-1234';

  if (supabase) {
    const { data, error } = await supabase
      .from('learner_profiles')
      .insert({
        teacher_id: teacherId,
        learner_code: learnerCode.toUpperCase().trim(),
        category,
        current_level: level,
        notes
      })
      .select()
      .single();

    if (error) {
      setSaveStatus('error');
      throw new Error(error.message);
    }
    setSaveStatus('saved_cloud');
    return data;
  } else {
    const profiles = await getLearnerProfiles();
    const newProfile: LearnerProfile = {
      id: 'local-profile-' + Date.now(),
      teacher_id: teacherId,
      learner_code: learnerCode.toUpperCase().trim(),
      category,
      current_level: level,
      notes,
      created_at: new Date().toISOString()
    };
    profiles.unshift(newProfile);
    sessionStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    setSaveStatus('saved_offline');
    return newProfile;
  }
}

export async function deleteLearnerProfile(id: string): Promise<void> {
  setSaveStatus('saving');
  if (supabase) {
    const { error } = await supabase.from('learner_profiles').delete().eq('id', id);
    if (error) {
      setSaveStatus('error');
      throw new Error(error.message);
    }
    setSaveStatus('saved_cloud');
  } else {
    const profiles = await getLearnerProfiles();
    const filtered = profiles.filter((p) => p.id !== id);
    sessionStorage.setItem(LOCAL_STORAGE_KEY_PROFILES, JSON.stringify(filtered));
    setSaveStatus('saved_offline');
  }
}

// -------------------------------------------------------------
// GAME SESSIONS
// -------------------------------------------------------------
export async function createGameSession(
  learnerId: string,
  sessionType: 'baseline' | 'intervention' | 'post_intervention'
): Promise<GameSession> {
  setSaveStatus('saving');
  const teacher = await getCurrentTeacher();
  const teacherId = teacher?.id || 'demo-teacher-id-1234';

  if (supabase) {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        learner_id: learnerId,
        teacher_id: teacherId,
        session_type: sessionType,
        current_mission: 'tutorial',
        status: 'in_progress',
        total_hints_used: 0,
        highest_assistance_level: 0
      })
      .select()
      .single();

    if (error) {
      setSaveStatus('error');
      throw new Error(error.message);
    }
    setSaveStatus('saved_cloud');
    return data;
  } else {
    const raw = sessionStorage.getItem(LOCAL_STORAGE_KEY_SESSIONS);
    const sessions: GameSession[] = raw ? JSON.parse(raw) : [];
    const newSession: GameSession = {
      id: 'local-session-' + Date.now(),
      learner_id: learnerId,
      teacher_id: teacherId,
      session_type: sessionType,
      current_mission: 'tutorial',
      status: 'in_progress',
      started_at: new Date().toISOString(),
      total_hints_used: 0,
      highest_assistance_level: 0
    };
    sessions.unshift(newSession);
    sessionStorage.setItem(LOCAL_STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    setSaveStatus('saved_offline');
    return newSession;
  }
}

export async function updateSessionProgress(
  sessionId: string,
  updates: {
    current_mission?: MissionId;
    status?: 'in_progress' | 'completed';
    total_hints_used?: number;
    highest_assistance_level?: AssistanceLevel;
    completed_at?: string;
  }
): Promise<void> {
  setSaveStatus('saving');
  if (supabase) {
    const { error } = await supabase.from('game_sessions').update(updates).eq('id', sessionId);
    if (error) {
      setSaveStatus('error');
      throw new Error(error.message);
    }
    setSaveStatus('saved_cloud');
  } else {
    const raw = sessionStorage.getItem(LOCAL_STORAGE_KEY_SESSIONS);
    if (raw) {
      const sessions: GameSession[] = JSON.parse(raw);
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx !== -1) {
        sessions[idx] = { ...sessions[idx], ...updates };
        sessionStorage.setItem(LOCAL_STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
      }
    }
    setSaveStatus('saved_offline');
  }
}

export async function getGameSessions(learnerId?: string): Promise<GameSession[]> {
  if (supabase) {
    let query = supabase.from('game_sessions').select('*').order('started_at', { ascending: false });
    if (learnerId) {
      query = query.eq('learner_id', learnerId);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  } else {
    const raw = sessionStorage.getItem(LOCAL_STORAGE_KEY_SESSIONS);
    const sessions: GameSession[] = raw ? JSON.parse(raw) : [];
    return learnerId ? sessions.filter((s) => s.learner_id === learnerId) : sessions;
  }
}

// -------------------------------------------------------------
// TASK RESPONSES (Scaffolding tracking)
// -------------------------------------------------------------
export async function recordTaskResponse(response: Omit<TaskResponse, 'id' | 'created_at'>): Promise<TaskResponse> {
  setSaveStatus('saving');
  if (supabase) {
    const { data, error } = await supabase
      .from('task_responses')
      .insert({
        session_id: response.session_id,
        learner_id: response.learner_id,
        task_id: response.task_id,
        first_attempt_correct: response.first_attempt_correct,
        final_attempt_correct: response.final_attempt_correct,
        assistance_level_used: response.assistance_level_used,
        attempts_count: response.attempts_count,
        selected_option_id: response.selected_option_id
      })
      .select()
      .single();

    if (error) {
      setSaveStatus('error');
      throw new Error(error.message);
    }
    setSaveStatus('saved_cloud');
    return data;
  } else {
    const raw = sessionStorage.getItem(LOCAL_STORAGE_KEY_RESPONSES);
    const responses: TaskResponse[] = raw ? JSON.parse(raw) : [];
    const newRecord: TaskResponse = {
      ...response,
      id: 'local-resp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString()
    };
    responses.push(newRecord);
    sessionStorage.setItem(LOCAL_STORAGE_KEY_RESPONSES, JSON.stringify(responses));
    setSaveStatus('saved_offline');
    return newRecord;
  }
}

export async function getTaskResponses(learnerId?: string): Promise<TaskResponse[]> {
  if (supabase) {
    let query = supabase.from('task_responses').select('*').order('created_at', { ascending: true });
    if (learnerId) query = query.eq('learner_id', learnerId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  } else {
    const raw = sessionStorage.getItem(LOCAL_STORAGE_KEY_RESPONSES);
    const responses: TaskResponse[] = raw ? JSON.parse(raw) : [];
    return learnerId ? responses.filter((r) => r.learner_id === learnerId) : responses;
  }
}

// -------------------------------------------------------------
// ASSESSMENT RESULTS (Baseline & Post-intervention)
// -------------------------------------------------------------
export async function saveAssessmentResult(result: Omit<AssessmentResult, 'id' | 'created_at'>): Promise<AssessmentResult> {
  setSaveStatus('saving');
  if (supabase) {
    const { data, error } = await supabase
      .from('assessment_results')
      .insert({
        session_id: result.session_id,
        learner_id: result.learner_id,
        assessment_type: result.assessment_type,
        total_items: result.total_items,
        independent_correct_count: result.independent_correct_count,
        assisted_correct_count: result.assisted_correct_count,
        incorrect_count: result.incorrect_count,
        percentage: result.percentage,
        item_details: result.item_details
      })
      .select()
      .single();

    if (error) {
      setSaveStatus('error');
      throw new Error(error.message);
    }
    setSaveStatus('saved_cloud');
    return data;
  } else {
    const raw = sessionStorage.getItem(LOCAL_STORAGE_KEY_ASSESSMENTS);
    const assessments: AssessmentResult[] = raw ? JSON.parse(raw) : [];
    const newRecord: AssessmentResult = {
      ...result,
      id: 'local-assess-' + Date.now(),
      created_at: new Date().toISOString()
    };
    assessments.push(newRecord);
    sessionStorage.setItem(LOCAL_STORAGE_KEY_ASSESSMENTS, JSON.stringify(assessments));
    setSaveStatus('saved_offline');
    return newRecord;
  }
}

export async function getAssessmentResults(learnerId?: string): Promise<AssessmentResult[]> {
  if (supabase) {
    let query = supabase.from('assessment_results').select('*').order('created_at', { ascending: false });
    if (learnerId) query = query.eq('learner_id', learnerId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  } else {
    const raw = sessionStorage.getItem(LOCAL_STORAGE_KEY_ASSESSMENTS);
    const items: AssessmentResult[] = raw ? JSON.parse(raw) : [];
    return learnerId ? items.filter((a) => a.learner_id === learnerId) : items;
  }
}

// -------------------------------------------------------------
// ORAL READING OBSERVATIONS
// -------------------------------------------------------------
export async function saveOralReadingObservation(
  observation: Omit<OralReadingObservation, 'id' | 'created_at' | 'teacher_id'>
): Promise<OralReadingObservation> {
  setSaveStatus('saving');
  const teacher = await getCurrentTeacher();
  const teacherId = teacher?.id || 'demo-teacher-id-1234';

  if (supabase) {
    const { data, error } = await supabase
      .from('oral_reading_observations')
      .insert({
        ...observation,
        teacher_id: teacherId
      })
      .select()
      .single();

    if (error) {
      setSaveStatus('error');
      throw new Error(error.message);
    }
    setSaveStatus('saved_cloud');
    return data;
  } else {
    const raw = sessionStorage.getItem(LOCAL_STORAGE_KEY_OBSERVATIONS);
    const observations: OralReadingObservation[] = raw ? JSON.parse(raw) : [];
    const newRecord: OralReadingObservation = {
      ...observation,
      id: 'local-obs-' + Date.now(),
      teacher_id: teacherId,
      created_at: new Date().toISOString()
    };
    observations.push(newRecord);
    sessionStorage.setItem(LOCAL_STORAGE_KEY_OBSERVATIONS, JSON.stringify(observations));
    setSaveStatus('saved_offline');
    return newRecord;
  }
}

export async function getOralReadingObservations(learnerId?: string): Promise<OralReadingObservation[]> {
  if (supabase) {
    let query = supabase.from('oral_reading_observations').select('*').order('created_at', { ascending: false });
    if (learnerId) query = query.eq('learner_id', learnerId);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  } else {
    const raw = sessionStorage.getItem(LOCAL_STORAGE_KEY_OBSERVATIONS);
    const obs: OralReadingObservation[] = raw ? JSON.parse(raw) : [];
    return learnerId ? obs.filter((o) => o.learner_id === learnerId) : obs;
  }
}
