-- To ensure seed is run each time
-- ${flyway:timestamp}
INSERT INTO users("uuid", "name", "team_id")
VALUES 
  ('fef01237-6f6a-4b12-83b5-18874624ba54', 'hessu', (SELECT id FROM guild WHERE "name"='TiTe'))
ON CONFLICT ("uuid") DO UPDATE SET "name" = EXCLUDED.name;
