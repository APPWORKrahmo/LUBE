/*
  # LUBE - Real-time Multiplayer Party Game Schema

  ## Overview
  Complete database schema for LUBE, an 18+ real-time multiplayer party game with room-based gameplay,
  identity assignment, power cards, and consent-forward mechanics.

  ## New Tables

  ### `rooms`
  Manages game rooms with unique codes and real-time game state
  - `id` (uuid, primary key)
  - `room_code` (text, unique) - 6-character join code
  - `host_id` (uuid, nullable) - reference to host player
  - `status` (text) - 'lobby', 'code_of_play', 'game_active', 'ended'
  - `current_player_id` (uuid, nullable) - whose turn it is
  - `current_dare` (jsonb, nullable) - active dare/question
  - `current_category` (text, nullable) - 'dry', 'wet', 'slippery', 'foreplay'
  - `identity_pool` (jsonb) - remaining identities in "The Bitch Pile"
  - `created_at` (timestamptz)

  ### `players`
  Stores player data within rooms
  - `id` (uuid, primary key)
  - `room_code` (text) - which room they're in
  - `nickname` (text) - player chosen name
  - `identity` (text, nullable) - assigned identity (Twink, Bear, etc.)
  - `cards_remaining` (integer) - visible count of power cards
  - `is_host` (boolean) - can start game
  - `agreed_to_code` (boolean) - agreed to Code of Play
  - `secret_dare` (text, nullable) - their submitted secret dare
  - `position` (integer) - turn order
  - `created_at` (timestamptz)

  ### `player_cards`
  Individual power cards for each player (private)
  - `id` (uuid, primary key)
  - `player_id` (uuid) - card owner
  - `card_type` (text) - 'pass', 'transfer', 'challenge', 'left_right', 'secret_trigger', 'flip'
  - `used` (boolean) - whether card has been played
  - `created_at` (timestamptz)

  ### `content`
  Game dares and questions
  - `id` (uuid, primary key)
  - `category` (text) - 'dry', 'wet', 'slippery', 'foreplay'
  - `text` (text) - the dare or question

  ## Security
  - Enable RLS on all tables
  - Allow public read/write for game functionality (no auth required)
  - Restrict deletion to prevent data loss
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code text UNIQUE NOT NULL,
  host_id uuid,
  status text DEFAULT 'lobby' NOT NULL,
  current_player_id uuid,
  current_dare jsonb,
  current_category text,
  identity_pool jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code text NOT NULL REFERENCES rooms(room_code) ON DELETE CASCADE,
  nickname text NOT NULL,
  identity text,
  cards_remaining integer DEFAULT 7,
  is_host boolean DEFAULT false,
  agreed_to_code boolean DEFAULT false,
  secret_dare text,
  position integer,
  created_at timestamptz DEFAULT now()
);

-- Create player_cards table
CREATE TABLE IF NOT EXISTS player_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  card_type text NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create content table
CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  text text NOT NULL
);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rooms (allow all operations for no-auth game)
CREATE POLICY "Anyone can view rooms"
  ON rooms FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can create rooms"
  ON rooms FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update rooms"
  ON rooms FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for players
CREATE POLICY "Anyone can view players"
  ON players FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can create players"
  ON players FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update players"
  ON players FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for player_cards
CREATE POLICY "Anyone can view player_cards"
  ON player_cards FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can create player_cards"
  ON player_cards FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update player_cards"
  ON player_cards FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for content
CREATE POLICY "Anyone can view content"
  ON content FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can create content"
  ON content FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_players_room_code ON players(room_code);
CREATE INDEX IF NOT EXISTS idx_player_cards_player_id ON player_cards(player_id);
CREATE INDEX IF NOT EXISTS idx_content_category ON content(category);
CREATE INDEX IF NOT EXISTS idx_rooms_room_code ON rooms(room_code);