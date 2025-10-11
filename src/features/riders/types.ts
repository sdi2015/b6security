export interface Rider {
  id: string;
  account_id: string;
  full_name: string;
  discipline?: string | null;
  phone?: string | null;
  email?: string | null;
  is_active: boolean;
  notes?: string | null;
  created_at?: string;
}

export type RiderInput = {
  full_name: string;
  discipline?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
};
