-- To ensure seed is run each time
-- ${flyway:timestamp}
INSERT INTO guild("name", "logo")
VALUES 
  ('TiTe', ''),
  ('Skilta', ''),
  ('Autek', ''),
  ('Bioner', ''),
  ('Hiukkanen', ''),
  ('Indecs', ''),
  ('KoRK', ''),
  ('Man@ger', ''),
  ('MIK', ''),
  ('TamArk', ''),
  ('TARAKI', ''),
  ('YKI', ''),
  ('TeLE', ''),
  ('ESN INTO', ''),
  ('Wapputiimi', '')
ON CONFLICT ("name") DO UPDATE SET "name" = EXCLUDED.name;
