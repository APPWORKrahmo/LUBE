export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          room_code: string
          host_id: string | null
          status: 'lobby' | 'code_of_play' | 'game_active' | 'ended'
          current_player_id: string | null
          current_dare: Json | null
          current_category: 'dry' | 'wet' | 'slippery' | 'foreplay' | null
          identity_pool: Json
          created_at: string
        }
        Insert: {
          id?: string
          room_code: string
          host_id?: string | null
          status?: 'lobby' | 'code_of_play' | 'game_active' | 'ended'
          current_player_id?: string | null
          current_dare?: Json | null
          current_category?: 'dry' | 'wet' | 'slippery' | 'foreplay' | null
          identity_pool?: Json
          created_at?: string
        }
        Update: {
          id?: string
          room_code?: string
          host_id?: string | null
          status?: 'lobby' | 'code_of_play' | 'game_active' | 'ended'
          current_player_id?: string | null
          current_dare?: Json | null
          current_category?: 'dry' | 'wet' | 'slippery' | 'foreplay' | null
          identity_pool?: Json
          created_at?: string
        }
      }
      players: {
        Row: {
          id: string
          room_code: string
          nickname: string
          identity: string | null
          cards_remaining: number
          is_host: boolean
          agreed_to_code: boolean
          secret_dare: string | null
          position: number | null
          created_at: string
        }
        Insert: {
          id?: string
          room_code: string
          nickname: string
          identity?: string | null
          cards_remaining?: number
          is_host?: boolean
          agreed_to_code?: boolean
          secret_dare?: string | null
          position?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          room_code?: string
          nickname?: string
          identity?: string | null
          cards_remaining?: number
          is_host?: boolean
          agreed_to_code?: boolean
          secret_dare?: string | null
          position?: number | null
          created_at?: string
        }
      }
      player_cards: {
        Row: {
          id: string
          player_id: string
          card_type: 'pass' | 'transfer' | 'challenge' | 'left_right' | 'secret_trigger' | 'flip'
          used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          player_id: string
          card_type: 'pass' | 'transfer' | 'challenge' | 'left_right' | 'secret_trigger' | 'flip'
          used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: string
          card_type?: 'pass' | 'transfer' | 'challenge' | 'left_right' | 'secret_trigger' | 'flip'
          used?: boolean
          created_at?: string
        }
      }
      content: {
        Row: {
          id: string
          category: 'dry' | 'wet' | 'slippery' | 'foreplay'
          text: string
        }
        Insert: {
          id?: string
          category: 'dry' | 'wet' | 'slippery' | 'foreplay'
          text: string
        }
        Update: {
          id?: string
          category?: 'dry' | 'wet' | 'slippery' | 'foreplay'
          text?: string
        }
      }
    }
  }
}
