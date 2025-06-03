-- Add title column to notes table
ALTER TABLE notes ADD COLUMN title VARCHAR(255);

-- Update existing notes to have default titles
UPDATE notes SET title = 'Untitled Note' WHERE title IS NULL;

-- Make title NOT NULL for future inserts
ALTER TABLE notes ALTER COLUMN title SET NOT NULL;
