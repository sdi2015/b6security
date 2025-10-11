-- Migration: enforce security invoker on dashboard view and secure spatial_ref_sys exposure

-- Ensure the dashboard counts view runs as the caller so RLS applies
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'v'
      AND c.relname = 'v_dashboard_counts'
  ) THEN
    EXECUTE 'ALTER VIEW public.v_dashboard_counts SET (security_invoker = true)';
    EXECUTE 'ALTER VIEW public.v_dashboard_counts SET (security_barrier = true)';
  END IF;
END
$$;

-- Harden the PostGIS spatial reference catalog against API access by enabling RLS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relname = 'spatial_ref_sys'
  ) THEN
    EXECUTE 'ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY';
  END IF;
END
$$;

-- Create an explicit deny policy for PostGIS catalog reads from anon/authenticated roles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relname = 'spatial_ref_sys'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies p
      WHERE p.schemaname = 'public'
        AND p.tablename = 'spatial_ref_sys'
        AND p.policyname = 'deny_all_select_spatial_ref_sys'
    ) THEN
      EXECUTE 'CREATE POLICY deny_all_select_spatial_ref_sys ON public.spatial_ref_sys FOR SELECT TO anon, authenticated USING (false)';
    END IF;

    EXECUTE 'REVOKE ALL ON TABLE public.spatial_ref_sys FROM anon, authenticated';
  END IF;
END
$$;
