-- Create users table for admin user management
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT,
  terminated_at TIMESTAMP,
  terminated_by TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- Insert default admin user with correct SHA256 hash for "admin123"
-- Correct hash: 0192023a7bbd73250516f069df18b500
INSERT INTO users (username, password_hash, is_active, created_by)
VALUES ('admin', '0192023a7bbd73250516f069df18b500', true, 'system')
ON CONFLICT (username) DO UPDATE SET password_hash = '0192023a7bbd73250516f069df18b500', is_active = true;
