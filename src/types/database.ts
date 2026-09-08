/**
 * Type definitions matching the Supabase database schema.
 *
 * After connecting a Supabase project, replace this with the auto-generated file:
 *   npx supabase gen types typescript --linked > src/types/database.ts
 *
 * The `Relationships` field (empty arrays) is required by @supabase/supabase-js v2
 * for correct type inference on .insert() and .update() calls.
 */

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
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company: string | null;
          phone: string | null;
          role: "client" | "admin";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company?: string | null;
          phone?: string | null;
          role?: "client" | "admin";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          company?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          description: string | null;
          status: "scoping" | "active" | "review" | "completed" | "paused";
          start_date: string | null;
          due_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          title: string;
          description?: string | null;
          status?: "scoping" | "active" | "review" | "completed" | "paused";
          start_date?: string | null;
          due_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: "scoping" | "active" | "review" | "completed" | "paused";
          start_date?: string | null;
          due_date?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_milestones: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          completed: boolean;
          sort_order: number;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          completed?: boolean;
          sort_order?: number;
        };
        Update: {
          title?: string;
          description?: string | null;
          due_date?: string | null;
          completed?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      project_updates: {
        Row: {
          id: string;
          project_id: string;
          author_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          author_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          content?: string;
        };
        Relationships: [];
      };
      project_files: {
        Row: {
          id: string;
          project_id: string;
          uploaded_by: string;
          filename: string;
          storage_path: string;
          file_size: number;
          mime_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          uploaded_by: string;
          filename: string;
          storage_path: string;
          file_size: number;
          mime_type: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      tickets: {
        Row: {
          id: string;
          client_id: string;
          project_id: string | null;
          subject: string;
          status: "open" | "in_progress" | "resolved" | "closed";
          priority: "low" | "normal" | "high" | "urgent";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          project_id?: string | null;
          subject: string;
          status?: "open" | "in_progress" | "resolved" | "closed";
          priority?: "low" | "normal" | "high" | "urgent";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          subject?: string;
          status?: "open" | "in_progress" | "resolved" | "closed";
          priority?: "low" | "normal" | "high" | "urgent";
          project_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      ticket_messages: {
        Row: {
          id: string;
          ticket_id: string;
          author_id: string;
          content: string;
          is_internal: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          author_id: string;
          content: string;
          is_internal?: boolean;
          created_at?: string;
        };
        Update: {
          content?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          client_id: string;
          project_id: string | null;
          invoice_no: string;
          status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
          amount: number;
          currency: string;
          issued_date: string;
          due_date: string;
          paid_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          project_id?: string | null;
          invoice_no: string;
          status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
          amount: number;
          currency?: string;
          issued_date: string;
          due_date: string;
          paid_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
          amount?: number;
          due_date?: string;
          paid_date?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit_price: number;
          amount: number;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit_price: number;
        };
        Update: {
          description?: string;
          quantity?: number;
          unit_price?: number;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          read: boolean;
          link: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          read?: boolean;
          link?: string | null;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string;
          description: string;
          icon_name: string;
          sort_order: number;
          published: boolean;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary: string;
          description: string;
          icon_name: string;
          sort_order?: number;
          published?: boolean;
        };
        Update: {
          title?: string;
          summary?: string;
          description?: string;
          icon_name?: string;
          sort_order?: number;
          published?: boolean;
        };
        Relationships: [];
      };
      portfolio_projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string;
          description: string;
          tags: string[];
          image_path: string | null;
          sort_order: number;
          published: boolean;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary: string;
          description: string;
          tags?: string[];
          image_path?: string | null;
          sort_order?: number;
          published?: boolean;
        };
        Update: {
          title?: string;
          summary?: string;
          description?: string;
          tags?: string[];
          image_path?: string | null;
          sort_order?: number;
          published?: boolean;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          author_id: string;
          published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          author_id: string;
          published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          excerpt?: string;
          content?: string;
          published?: boolean;
          published_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience row types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectMilestone =
  Database["public"]["Tables"]["project_milestones"]["Row"];
export type ProjectUpdate =
  Database["public"]["Tables"]["project_updates"]["Row"];
export type ProjectFile = Database["public"]["Tables"]["project_files"]["Row"];
export type Ticket = Database["public"]["Tables"]["tickets"]["Row"];
export type TicketMessage =
  Database["public"]["Tables"]["ticket_messages"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceItem = Database["public"]["Tables"]["invoice_items"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type PortfolioProject =
  Database["public"]["Tables"]["portfolio_projects"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
