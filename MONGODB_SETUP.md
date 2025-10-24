# MongoDB Setup Guide

## Quick Start

Your app is now configured to use MongoDB instead of Supabase. Follow these steps:

### 1. Add Environment Variable

In your Vercel project settings, add this environment variable:

\`\`\`
MONGODB_URI=mongodb+srv://urstark:unrucgfS4hw2R99h@cluster0.avdjjhi.mongodb.net/?appName=Cluster0
\`\`\`

### 2. Initialize Database

The database will be automatically initialized on first login attempt. However, you can manually initialize it by:

1. Going to your MongoDB Atlas dashboard
2. Verifying the `starkosint` database exists
3. The `users` collection will be created automatically

### 3. Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

### 4. Login and Create Users

1. Login with admin credentials
2. You'll be redirected to the Admin Dashboard
3. Create new user accounts with custom usernames and passwords
4. Users can then login and access all OSINT tools

### 5. User Management

From the Admin Dashboard, you can:
- ✅ Create new user accounts
- ✅ View all users and their status
- ✅ Terminate user accounts (prevents future logins)
- ✅ See creation dates and termination status

## Features

✅ **MongoDB Integration** - Permanent, scalable database
✅ **User Authentication** - Secure login system
✅ **Admin Dashboard** - Full user management
✅ **User Termination** - Prevent terminated users from logging in
✅ **Horizontal Tabs** - Better UI layout
✅ **Copy JSON** - Copy search results to clipboard
✅ **Dark Mode** - Working theme toggle
✅ **Free Public APIs** - Domain, Crypto, Weather data

## Troubleshooting

### Can't login with admin credentials?
- Make sure `MONGODB_URI` environment variable is set in Vercel
- Check MongoDB Atlas connection string is correct
- Verify the database exists in MongoDB Atlas

### Users table not created?
- The table is created automatically on first login
- If issues persist, manually create a `users` collection in MongoDB Atlas

### Terminated users can still login?
- Clear browser cache and localStorage
- The `terminated_at` field must be set in the database

## API Endpoints

- `POST /api/auth/login` - User login
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `POST /api/admin/users/[id]/terminate` - Terminate user account
