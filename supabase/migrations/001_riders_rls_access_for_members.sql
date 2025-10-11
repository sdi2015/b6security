-- Migration: allow account members to view riders while preserving existing write controls

-- Grant read-only access to any authenticated user who belongs to the rider's account
CREATE POLICY "Account members can view rider rows"
ON public.riders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.account_members am
    WHERE am.account_id = riders.account_id
      AND am.user_id = auth.uid()
  )
);

-- Ensure new riders are active by default so they appear in the UI list filters
ALTER TABLE public.riders
  ALTER COLUMN is_active SET DEFAULT true;

-- Improve lookup performance for account-scoped active rider queries
CREATE INDEX IF NOT EXISTS riders_account_active_idx
  ON public.riders (account_id, is_active);
