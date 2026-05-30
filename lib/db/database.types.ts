// Generated from the live Supabase schema (MCP: generate_typescript_types).
// Do not edit by hand — regenerate after migrations with:
//   supabase gen types typescript --project-id <id>  (or the MCP tool)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admission_records: {
        Row: {
          applicant_gpa_4_0: number | null;
          applicant_lang_score: number | null;
          applicant_lang_test: string | null;
          created_at: string | null;
          id: number;
          outcome: string | null;
          program_id: number;
          synthetic: boolean | null;
          university_id: number | null;
          year: number | null;
        };
        Insert: {
          applicant_gpa_4_0?: number | null;
          applicant_lang_score?: number | null;
          applicant_lang_test?: string | null;
          created_at?: string | null;
          id: number;
          outcome?: string | null;
          program_id: number;
          synthetic?: boolean | null;
          university_id?: number | null;
          year?: number | null;
        };
        Update: {
          applicant_gpa_4_0?: number | null;
          applicant_lang_score?: number | null;
          applicant_lang_test?: string | null;
          created_at?: string | null;
          id?: number;
          outcome?: string | null;
          program_id?: number;
          synthetic?: boolean | null;
          university_id?: number | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "admission_records_program_id_fkey";
            columns: ["program_id"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "admission_records_university_id_fkey";
            columns: ["university_id"];
            isOneToOne: false;
            referencedRelation: "universities";
            referencedColumns: ["id"];
          },
        ];
      };
      applications: {
        Row: {
          created_at: string | null;
          id: string;
          notes: string | null;
          probability_band: string | null;
          probability_score: number | null;
          program_id: number;
          status: Database["public"]["Enums"]["application_status"];
          student_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          probability_band?: string | null;
          probability_score?: number | null;
          program_id: number;
          status?: Database["public"]["Enums"]["application_status"];
          student_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          notes?: string | null;
          probability_band?: string | null;
          probability_score?: number | null;
          program_id?: number;
          status?: Database["public"]["Enums"]["application_status"];
          student_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "applications_program_id_fkey";
            columns: ["program_id"];
            isOneToOne: false;
            referencedRelation: "programs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "applications_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      documents: {
        Row: {
          application_id: string;
          content: string;
          created_at: string | null;
          id: string;
          title: string | null;
          type: Database["public"]["Enums"]["document_type"];
          updated_at: string | null;
          version: number;
        };
        Insert: {
          application_id: string;
          content?: string;
          created_at?: string | null;
          id?: string;
          title?: string | null;
          type: Database["public"]["Enums"]["document_type"];
          updated_at?: string | null;
          version?: number;
        };
        Update: {
          application_id?: string;
          content?: string;
          created_at?: string | null;
          id?: string;
          title?: string | null;
          type?: Database["public"]["Enums"]["document_type"];
          updated_at?: string | null;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "documents_application_id_fkey";
            columns: ["application_id"];
            isOneToOne: false;
            referencedRelation: "applications";
            referencedColumns: ["id"];
          },
        ];
      };
      programs: {
        Row: {
          created_at: string | null;
          deadline_fall_intake: string | null;
          deadline_spring_intake: string | null;
          degree_level: string | null;
          english_min_ielts: number | null;
          field: string | null;
          id: number;
          language_of_instruction: string | null;
          min_gpa_4_0_scale: number | null;
          name: string;
          scholarship_notes: string | null;
          topik_required_level: number | null;
          tuition_krw_per_semester: number | null;
          university_id: number;
        };
        Insert: {
          created_at?: string | null;
          deadline_fall_intake?: string | null;
          deadline_spring_intake?: string | null;
          degree_level?: string | null;
          english_min_ielts?: number | null;
          field?: string | null;
          id: number;
          language_of_instruction?: string | null;
          min_gpa_4_0_scale?: number | null;
          name: string;
          scholarship_notes?: string | null;
          topik_required_level?: number | null;
          tuition_krw_per_semester?: number | null;
          university_id: number;
        };
        Update: {
          created_at?: string | null;
          deadline_fall_intake?: string | null;
          deadline_spring_intake?: string | null;
          degree_level?: string | null;
          english_min_ielts?: number | null;
          field?: string | null;
          id?: number;
          language_of_instruction?: string | null;
          min_gpa_4_0_scale?: number | null;
          name?: string;
          scholarship_notes?: string | null;
          topik_required_level?: number | null;
          tuition_krw_per_semester?: number | null;
          university_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "programs_university_id_fkey";
            columns: ["university_id"];
            isOneToOne: false;
            referencedRelation: "universities";
            referencedColumns: ["id"];
          },
        ];
      };
      students: {
        Row: {
          budget_usd: number | null;
          country: string | null;
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          gpa: number | null;
          gpa_scale: number | null;
          id: string;
          intended_degree: string | null;
          intended_field: string | null;
          language_score: number | null;
          language_test: string | null;
          updated_at: string | null;
        };
        Insert: {
          budget_usd?: number | null;
          country?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          gpa?: number | null;
          gpa_scale?: number | null;
          id: string;
          intended_degree?: string | null;
          intended_field?: string | null;
          language_score?: number | null;
          language_test?: string | null;
          updated_at?: string | null;
        };
        Update: {
          budget_usd?: number | null;
          country?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          gpa?: number | null;
          gpa_scale?: number | null;
          id?: string;
          intended_degree?: string | null;
          intended_field?: string | null;
          language_score?: number | null;
          language_test?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      universities: {
        Row: {
          application_fee_krw: number | null;
          city: string | null;
          country: string | null;
          created_at: string | null;
          data_confidence: string | null;
          dorm_krw_per_semester: number | null;
          dorm_usd_per_semester: number | null;
          english_min_ielts: number | null;
          english_min_toefl_ibt: number | null;
          id: number;
          intl_office_note: string | null;
          kr_rank_unirank_2026: number | null;
          living_krw_per_month: number | null;
          living_usd_per_month: number | null;
          name: string;
          offers_english_programs: boolean | null;
          region: string | null;
          scholarship_note: string | null;
          slug: string;
          tier_band: string | null;
          topik_min_grad: number | null;
          topik_min_undergrad: number | null;
          tuition_grad_krw_max: number | null;
          tuition_grad_krw_min: number | null;
          tuition_ug_krw_max: number | null;
          tuition_ug_krw_min: number | null;
          tuition_ug_usd_max: number | null;
          tuition_ug_usd_min: number | null;
          type: string | null;
          verify_before_launch: boolean | null;
          visa_cost_usd: number | null;
          website: string | null;
        };
        Insert: {
          application_fee_krw?: number | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          data_confidence?: string | null;
          dorm_krw_per_semester?: number | null;
          dorm_usd_per_semester?: number | null;
          english_min_ielts?: number | null;
          english_min_toefl_ibt?: number | null;
          id: number;
          intl_office_note?: string | null;
          kr_rank_unirank_2026?: number | null;
          living_krw_per_month?: number | null;
          living_usd_per_month?: number | null;
          name: string;
          offers_english_programs?: boolean | null;
          region?: string | null;
          scholarship_note?: string | null;
          slug: string;
          tier_band?: string | null;
          topik_min_grad?: number | null;
          topik_min_undergrad?: number | null;
          tuition_grad_krw_max?: number | null;
          tuition_grad_krw_min?: number | null;
          tuition_ug_krw_max?: number | null;
          tuition_ug_krw_min?: number | null;
          tuition_ug_usd_max?: number | null;
          tuition_ug_usd_min?: number | null;
          type?: string | null;
          verify_before_launch?: boolean | null;
          visa_cost_usd?: number | null;
          website?: string | null;
        };
        Update: {
          application_fee_krw?: number | null;
          city?: string | null;
          country?: string | null;
          created_at?: string | null;
          data_confidence?: string | null;
          dorm_krw_per_semester?: number | null;
          dorm_usd_per_semester?: number | null;
          english_min_ielts?: number | null;
          english_min_toefl_ibt?: number | null;
          id?: number;
          intl_office_note?: string | null;
          kr_rank_unirank_2026?: number | null;
          living_krw_per_month?: number | null;
          living_usd_per_month?: number | null;
          name?: string;
          offers_english_programs?: boolean | null;
          region?: string | null;
          scholarship_note?: string | null;
          slug?: string;
          tier_band?: string | null;
          topik_min_grad?: number | null;
          topik_min_undergrad?: number | null;
          tuition_grad_krw_max?: number | null;
          tuition_grad_krw_min?: number | null;
          tuition_ug_krw_max?: number | null;
          tuition_ug_krw_min?: number | null;
          tuition_ug_usd_max?: number | null;
          tuition_ug_usd_min?: number | null;
          type?: string | null;
          verify_before_launch?: boolean | null;
          visa_cost_usd?: number | null;
          website?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      application_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "interview"
        | "decision";
      document_type: "sop" | "study_plan" | "personal_statement";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database["public"];

export type Tables<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][T]["Update"];
export type Enums<T extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][T];

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "draft",
        "submitted",
        "under_review",
        "interview",
        "decision",
      ],
      document_type: ["sop", "study_plan", "personal_statement"],
    },
  },
} as const;
