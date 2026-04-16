export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      subjects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          year: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          year?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          year?: number | null;
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          subject_id: string;
          title: string;
          type: "past_paper" | "notes" | "other";
          language: "en" | "fr";
          storage_path: string;
          extracted_text: string | null;
          summary: string | null;
          key_topics: string[] | null;
          exam_year: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subject_id: string;
          title: string;
          type: "past_paper" | "notes" | "other";
          language?: "en" | "fr";
          storage_path: string;
          extracted_text?: string | null;
          summary?: string | null;
          key_topics?: string[] | null;
          exam_year?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          subject_id?: string;
          title?: string;
          type?: "past_paper" | "notes" | "other";
          language?: "en" | "fr";
          storage_path?: string;
          extracted_text?: string | null;
          summary?: string | null;
          key_topics?: string[] | null;
          exam_year?: number | null;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          document_id: string;
          subject_id: string;
          type: "multiple_choice" | "short_answer";
          question: string;
          options: string[] | null;
          correct_answer: string;
          explanation: string | null;
          difficulty: "easy" | "medium" | "hard" | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          subject_id: string;
          type: "multiple_choice" | "short_answer";
          question: string;
          options?: string[] | null;
          correct_answer: string;
          explanation?: string | null;
          difficulty?: "easy" | "medium" | "hard" | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          subject_id?: string;
          type?: "multiple_choice" | "short_answer";
          question?: string;
          options?: string[] | null;
          correct_answer?: string;
          explanation?: string | null;
          difficulty?: "easy" | "medium" | "hard" | null;
          created_at?: string;
        };
      };
      test_attempts: {
        Row: {
          id: string;
          user_id: string;
          subject_id: string;
          score: number;
          total_questions: number;
          time_taken_seconds: number | null;
          answers: Json;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject_id: string;
          score: number;
          total_questions: number;
          time_taken_seconds?: number | null;
          answers: Json;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject_id?: string;
          score?: number;
          total_questions?: number;
          time_taken_seconds?: number | null;
          answers?: Json;
          completed_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
