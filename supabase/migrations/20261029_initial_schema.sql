-- =========================================================================
-- DETEKTIF CILIK 3D: MISTERI KOTAK HILANG
-- Supabase PostgreSQL Schema & Row Level Security (RLS) Migrations
-- Individual University Assignment: HPPK 2 (MBPK Masalah Pembelajaran)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. LEARNER PROFILES (Profil Murid Berkeperluan Pendidikan Khas - Pseudonymous)
CREATE TABLE IF NOT EXISTS public.learner_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    learner_code VARCHAR(50) NOT NULL, -- e.g. MBPK-A01 (Tanpa data peribadi sebenar / PII)
    category VARCHAR(100) DEFAULT 'Masalah Pembelajaran',
    current_level INT DEFAULT 1 CHECK (current_level IN (1, 2, 3)),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_teacher_learner_code UNIQUE (teacher_id, learner_code)
);

-- Index for teacher lookup
CREATE INDEX IF NOT EXISTS idx_learner_profiles_teacher ON public.learner_profiles(teacher_id);

-- 2. GAME SESSIONS (Sesi Permainan / Intervensi)
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learner_id UUID NOT NULL REFERENCES public.learner_profiles(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('baseline', 'intervention', 'post_intervention')),
    current_mission VARCHAR(50) DEFAULT 'tutorial',
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    total_hints_used INT DEFAULT 0,
    highest_assistance_level INT DEFAULT 0 CHECK (highest_assistance_level IN (0, 1, 2, 3)),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_game_sessions_learner ON public.game_sessions(learner_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_teacher ON public.game_sessions(teacher_id);

-- 3. TASK RESPONSES (Tindak Balas Tugasan Kefahaman Ayat)
CREATE TABLE IF NOT EXISTS public.task_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    learner_id UUID NOT NULL REFERENCES public.learner_profiles(id) ON DELETE CASCADE,
    task_id VARCHAR(100) NOT NULL,
    first_attempt_correct BOOLEAN NOT NULL,
    final_attempt_correct BOOLEAN NOT NULL,
    assistance_level_used INT NOT NULL DEFAULT 0 CHECK (assistance_level_used IN (0, 1, 2, 3)),
    attempts_count INT NOT NULL DEFAULT 1,
    selected_option_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_responses_session ON public.task_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_task_responses_learner ON public.task_responses(learner_id);

-- 4. ASSESSMENT RESULTS (Hasil Penilaian Pra & Pasca Intervensi)
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    learner_id UUID NOT NULL REFERENCES public.learner_profiles(id) ON DELETE CASCADE,
    assessment_type VARCHAR(50) NOT NULL CHECK (assessment_type IN ('baseline', 'post_intervention')),
    total_items INT NOT NULL DEFAULT 10,
    independent_correct_count INT NOT NULL DEFAULT 0,
    assisted_correct_count INT NOT NULL DEFAULT 0,
    incorrect_count INT NOT NULL DEFAULT 0,
    percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    item_details JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessment_results_learner ON public.assessment_results(learner_id);

-- 5. ORAL READING OBSERVATIONS (Borang Pemerhatian Bacaan Lisan Guru)
CREATE TABLE IF NOT EXISTS public.oral_reading_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learner_id UUID NOT NULL REFERENCES public.learner_profiles(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    passage_title VARCHAR(200) NOT NULL,
    total_words_presented INT NOT NULL CHECK (total_words_presented >= 0),
    words_read_correctly INT NOT NULL CHECK (words_read_correctly >= 0),
    accuracy_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    assistance_level INT DEFAULT 0 CHECK (assistance_level IN (0, 1, 2, 3)),
    errors_omission INT DEFAULT 0,
    errors_substitution INT DEFAULT 0,
    errors_mispronunciation INT DEFAULT 0,
    errors_hesitation INT DEFAULT 0,
    teacher_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oral_reading_learner ON public.oral_reading_observations(learner_id);
CREATE INDEX IF NOT EXISTS idx_oral_reading_teacher ON public.oral_reading_observations(teacher_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Teachers may ONLY view and modify their own records.
-- =========================================================================

-- Enable RLS
ALTER TABLE public.learner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oral_reading_observations ENABLE ROW LEVEL SECURITY;

-- 1. Learner Profiles Policies
CREATE POLICY "Teachers can view own learner profiles"
    ON public.learner_profiles FOR SELECT
    USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert own learner profiles"
    ON public.learner_profiles FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own learner profiles"
    ON public.learner_profiles FOR UPDATE
    USING (auth.uid() = teacher_id)
    WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own learner profiles"
    ON public.learner_profiles FOR DELETE
    USING (auth.uid() = teacher_id);

-- 2. Game Sessions Policies
CREATE POLICY "Teachers can view own game sessions"
    ON public.game_sessions FOR SELECT
    USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert own game sessions"
    ON public.game_sessions FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own game sessions"
    ON public.game_sessions FOR UPDATE
    USING (auth.uid() = teacher_id)
    WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own game sessions"
    ON public.game_sessions FOR DELETE
    USING (auth.uid() = teacher_id);

-- 3. Task Responses Policies (Ownership verified through parent session)
CREATE POLICY "Teachers can view responses for own sessions"
    ON public.task_responses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.game_sessions s
            WHERE s.id = task_responses.session_id
            AND s.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can insert responses for own sessions"
    ON public.task_responses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.game_sessions s
            WHERE s.id = task_responses.session_id
            AND s.teacher_id = auth.uid()
        )
    );

-- 4. Assessment Results Policies
CREATE POLICY "Teachers can view assessment results for own learners"
    ON public.assessment_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.game_sessions s
            WHERE s.id = assessment_results.session_id
            AND s.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can insert assessment results for own learners"
    ON public.assessment_results FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.game_sessions s
            WHERE s.id = assessment_results.session_id
            AND s.teacher_id = auth.uid()
        )
    );

-- 5. Oral Reading Observations Policies
CREATE POLICY "Teachers can view own oral reading observations"
    ON public.oral_reading_observations FOR SELECT
    USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert own oral reading observations"
    ON public.oral_reading_observations FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own oral reading observations"
    ON public.oral_reading_observations FOR UPDATE
    USING (auth.uid() = teacher_id)
    WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own oral reading observations"
    ON public.oral_reading_observations FOR DELETE
    USING (auth.uid() = teacher_id);
