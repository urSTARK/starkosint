-- Seed default admin user
-- Username: admin
-- Password: admin123
-- Password hash (SHA256): 0192023a7bbd73250516f069df18b500

INSERT INTO users (username, password_hash, is_active, created_by)
VALUES ('admin', '0192023a7bbd73250516f069df18b500', true, 'system')
ON CONFLICT (username) DO NOTHING;
