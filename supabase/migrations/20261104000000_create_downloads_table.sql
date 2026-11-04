-- Create downloads tracking table for FitFlow landing page & app logins
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  user_email TEXT,
  platform TEXT NOT NULL DEFAULT 'web',
  source TEXT NOT NULL DEFAULT 'landing_download',
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for rapid queries in Table Editor
CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON public.downloads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_source ON public.downloads(source);
CREATE INDEX IF NOT EXISTS idx_downloads_user_email ON public.downloads(user_email);

-- Enable RLS and permissive policy so server routes can insert and read
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'downloads' AND policyname = 'Allow service and public tracking access'
  ) THEN
    CREATE POLICY "Allow service and public tracking access" ON public.downloads
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;
