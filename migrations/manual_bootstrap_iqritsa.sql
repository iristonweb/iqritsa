CREATE TABLE IF NOT EXISTS anti_cheat_events (
  id serial PRIMARY KEY,
  user_id text NOT NULL,
  session_id text NOT NULL,
  suspicion_score integer DEFAULT 0 NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS iq_profiles (
  id serial PRIMARY KEY,
  user_id text NOT NULL,
  player_name text DEFAULT 'IQPlayer' NOT NULL,
  profile_data jsonb DEFAULT '{}'::jsonb NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS iq_profiles_user_id_unique
  ON iq_profiles (user_id);

CREATE TABLE IF NOT EXISTS pvp_matches (
  id serial PRIMARY KEY,
  match_id text NOT NULL,
  winner_user_id text,
  player_a_user_id text NOT NULL,
  player_b_user_id text NOT NULL,
  score_a integer DEFAULT 0 NOT NULL,
  score_b integer DEFAULT 0 NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb NOT NULL,
  finished_at timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS pvp_matches_match_id_unique
  ON pvp_matches (match_id);
