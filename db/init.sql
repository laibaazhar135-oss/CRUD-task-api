CREATE TABLE IF NOT EXISTS tasks(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
INSERT INTO tasks (title,done)
SELECT * FROM (VALUES
  ('Buy milk', false),
  ('Walk the dog', false),
  ('Finish assignment', false))
  AS seed(title,done)
  WHERE NOT EXISTS(SELECT 1 FROM tasks);