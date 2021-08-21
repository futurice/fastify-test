-- To ensure seed is run each time
-- ${flyway:timestamp}
INSERT INTO guild("name", "logo")
VALUES 
  ('TiTe', '')
ON CONFLICT ("name") DO UPDATE SET "name" = EXCLUDED.name;
