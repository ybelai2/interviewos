-- Initial schema for InterviewOS minimal resume analysis

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  name text,
  plan text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  filename text NOT NULL,
  storage_path text NOT NULL,
  text_excerpt text,
  uploaded_at timestamptz DEFAULT now(),
  status text DEFAULT 'uploaded'
);

CREATE TABLE IF NOT EXISTS resume_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  analysis jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  text text NOT NULL,
  category text,
  risk text,
  status text,
  reason text,
  related_skill_ids jsonb
);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  estimated_proficiency int,
  importance int,
  metadata jsonb
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE,
  name text,
  description text,
  technologies jsonb,
  highlights jsonb
);
