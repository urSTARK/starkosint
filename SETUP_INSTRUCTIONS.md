# Stark OSINT - MongoDB Setup Instructions

## ✅ What's Been Done

Your app has been completely migrated from Supabase to MongoDB with the following features:

### Database
- ✅ MongoDB Atlas integration (free tier)
- ✅ Automatic user collection creation
- ✅ Unique username constraint
- ✅ User termination tracking

### Authentication
- ✅ Secure password hashing (SHA256)
- ✅ Default admin user (admin/admin123)
- ✅ Terminated user prevention
- ✅ Active/inactive user status

### Admin Dashboard
- ✅ Create new user accounts
- ✅ View all users with status
- ✅ Terminate user accounts
- ✅ See creation dates and termination info

### UI Improvements
- ✅ Horizontal tab layout (organized by category)
- ✅ Copy JSON button on all search results
- ✅ Working dark mode toggle
- ✅ Responsive design

### APIs (Working with Free Public Services)
- ✅ Domain Check - Google DNS API
- ✅ Crypto Price - CoinGecko API
- ✅ Weather - Open-Meteo API
- ✅ All other OSINT tools

## 🚀 How to Deploy

### Step 1: Add Environment Variable to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add this variable:
   \`\`\`
   MONGODB_URI=mongodb+srv://urstark:unrucgfS4hw2R99h@cluster0.avdjjhi.mongodb.net/?appName=Cluster0
   \`\`\`
4. Click **Save**

### Step 2: Deploy

1. Push your code to GitHub (or use Vercel's deployment)
2. Vercel will automatically deploy with the new MongoDB configuration

### Step 3: Test Login

1. Go to your deployed app
2. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`
3. You should see the Admin Dashboard

### Step 4: Create Users

1. In Admin Dashboard, enter a username and password
2. Click "Create User"
3. Share credentials with users
4. Users can now login and use all OSINT tools

## 📋 Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change this password after first login by creating a new admin account and terminating the default one.

## 🔐 User Management

### Create User
1. Login as admin
2. Enter username and password
3. Click "Create User"
4. User can now login

### Terminate User
1. Go to Admin Dashboard
2. Find user in the table
3. Click "Terminate" button
4. User cannot login anymore with those credentials

### Check User Status
- **Active** (green) - User can login
- **Terminated** (red) - User cannot login

## 🛠️ Troubleshooting

### Issue: Can't login with admin/admin123

**Solution:**
1. Check if `MONGODB_URI` is set in Vercel environment variables
2. Verify MongoDB Atlas connection string is correct
3. Check MongoDB Atlas dashboard to see if database exists
4. Try clearing browser cache and cookies

### Issue: Users table doesn't exist

**Solution:**
- The table is created automatically on first login
- If it doesn't appear, manually create a collection named `users` in MongoDB Atlas

### Issue: Terminated users can still login

**Solution:**
1. Clear browser localStorage
2. Check MongoDB to verify `terminated_at` field is set
3. Restart the app

### Issue: Dark mode not working

**Solution:**
1. Click the theme toggle button (sun/moon icon)
2. Check browser console for errors
3. Clear localStorage and try again

## 📊 Database Schema

### Users Collection

\`\`\`javascript
{
  _id: ObjectId,
  username: String (unique),
  password_hash: String (SHA256),
  is_active: Boolean,
  created_at: Date,
  created_by: String,
  terminated_at: Date (null if active),
  terminated_by: String (null if active)
}
\`\`\`

## 🔗 Useful Links

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Your Cluster: https://cloud.mongodb.com/v2/67193e97b8d9c7c8e8e8e8e8#clusters
- Vercel Dashboard: https://vercel.com/dashboard

## ✨ Features Summary

| Feature | Status |
|---------|--------|
| MongoDB Integration | ✅ |
| User Authentication | ✅ |
| Admin Dashboard | ✅ |
| User Creation | ✅ |
| User Termination | ✅ |
| Horizontal Tabs | ✅ |
| Copy JSON Button | ✅ |
| Dark Mode | ✅ |
| Domain Check API | ✅ |
| Crypto Price API | ✅ |
| Weather API | ✅ |
| All OSINT Tools | ✅ |

---

**Your app is ready to deploy! 🚀**
