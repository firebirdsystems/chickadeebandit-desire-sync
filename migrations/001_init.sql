CREATE TABLE IF NOT EXISTS app_desire_sync__partner_config (
  member_id TEXT NOT NULL,
  partner_id TEXT NOT NULL,
  PRIMARY KEY (member_id)
);

CREATE TABLE IF NOT EXISTS app_desire_sync__signals (
  member_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  PRIMARY KEY (member_id)
);
