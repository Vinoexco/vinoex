export type Wine = {
  id: string;
  slug: string;
  canonical_producer: string;
  vintage: number;
  format_ml: number;
  pack_size: number;
  format_label: string;
  created_at: string;
};

export type EstimatedValue = {
  id: string;
  wine_id: string;
  estimated_value_gbp: number;
  source_count: number;
  last_updated: string;
  as_of_date: string;
  computed_at: string;
};

export type MarketLot = {
  wine: Wine;
  estimate: EstimatedValue | null;
};

export type WaitlistSignup = {
  id: string;
  email: string;
  name: string | null;
  interest: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      wines: {
        Row: Wine;
        Insert: Omit<Wine, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Wine>;
        Relationships: [];
      };
      estimated_values: {
        Row: EstimatedValue;
        Insert: Omit<EstimatedValue, "id" | "computed_at"> & {
          id?: string;
          computed_at?: string;
        };
        Update: Partial<EstimatedValue>;
        Relationships: [];
      };
      waitlist_signups: {
        Row: WaitlistSignup;
        Insert: {
          email: string;
          name?: string | null;
          interest?: string | null;
          id?: string;
          created_at?: string;
        };
        Update: Partial<WaitlistSignup>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
