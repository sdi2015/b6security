-- Migration: remove legacy rider data structures
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'riders'
  ) THEN
    EXECUTE 'DROP POLICY IF EXISTS "Account members can view rider rows" ON public.riders';
    EXECUTE 'DROP INDEX IF EXISTS public.riders_account_active_idx';
    EXECUTE 'DROP TABLE public.riders CASCADE';
  END IF;
END
$$;
