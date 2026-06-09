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
      };
    };
  };
};
