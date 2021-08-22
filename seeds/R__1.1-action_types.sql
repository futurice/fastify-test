-- To ensure seed is run each time
-- ${flyway:timestamp}
INSERT INTO action_type("code", "name", "value", "cooldown", "is_user_action")
VALUES 
  ('SIMA', 'Grab a sima', 1, 5 * 60 * 1000, TRUE),
  ('IMAGE', 'Pics or it didn''t happen', 1, 5 * 60 * 1000, TRUE),
  ('TEXT', 'Comment', 1, 10 * 1000, TRUE)
ON CONFLICT ("code") DO UPDATE SET 
  "name" = EXCLUDED.name,
  "value" = EXCLUDED.value,
  "cooldown" = EXCLUDED.cooldown,
  "is_user_action" = EXCLUDED.is_user_action;