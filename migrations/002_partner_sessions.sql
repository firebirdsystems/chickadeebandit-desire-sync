ALTER TABLE app_desire_sync__partner_config ADD COLUMN session_id TEXT;
ALTER TABLE app_desire_sync__signals ADD COLUMN session_id TEXT;

CREATE INDEX IF NOT EXISTS app_desire_sync__idx_signals_session
  ON app_desire_sync__signals (session_id);
