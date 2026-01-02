ALTER TABLE entities ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

-- Approve all existing entities
UPDATE entities SET status = 'approved';
