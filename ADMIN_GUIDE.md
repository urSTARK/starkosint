# Admin Guide - Stark OSINT

## Changing Admin Credentials

Your admin credentials are stored securely in MongoDB. To change the admin username and password, follow these steps:

### Option 1: Using MongoDB Atlas UI (Recommended)

1. **Go to MongoDB Atlas Dashboard**
   - Visit https://cloud.mongodb.com
   - Login with your account
   - Select your cluster

2. **Access the Database**
   - Click "Browse Collections"
   - Find your database and the "users" collection

3. **Find the Admin User**
   - Look for the document with `username: "admin"`
   - Click on it to edit

4. **Update Credentials**
   - To change username: Update the `username` field
   - To change password: Update the `password_hash` field
   
   **Important:** You need to hash the new password using SHA256:
   - Use an online SHA256 generator: https://www.sha256online.com/
   - Enter your new password and copy the hash
   - Paste the hash into the `password_hash` field

5. **Save Changes**
   - Click "Update" to save

### Option 2: Using MongoDB Compass (Desktop App)

1. Download MongoDB Compass from https://www.mongodb.com/products/compass
2. Connect using your MongoDB URI
3. Navigate to your database → users collection
4. Find the admin document and edit it directly
5. Update username and password_hash as described above

### Option 3: Using API Route (Advanced)

Create a new API route to update credentials programmatically:

\`\`\`typescript
// app/api/admin/change-credentials/route.ts
import { connectDB } from "@/lib/mongodb"
import crypto from "crypto"

export async function POST(req: Request) {
  const { oldPassword, newUsername, newPassword } = await req.json()
  
  const db = await connectDB()
  const users = db.collection("users")
  
  // Verify old password
  const admin = await users.findOne({ username: "admin" })
  const oldHash = crypto.createHash("sha256").update(oldPassword).digest("hex")
  
  if (admin.password_hash !== oldHash) {
    return Response.json({ error: "Invalid current password" }, { status: 401 })
  }
  
  // Update credentials
  const newHash = crypto.createHash("sha256").update(newPassword).digest("hex")
  
  await users.updateOne(
    { username: "admin" },
    {
      $set: {
        username: newUsername,
        password_hash: newHash,
      },
    }
  )
  
  return Response.json({ success: true, message: "Credentials updated" })
}
\`\`\`

## Managing Users

### Create New User
1. Login as admin
2. Go to Admin Dashboard
3. Click "Create User"
4. Enter username and password
5. Click "Create"

### Terminate User
1. Login as admin
2. Go to Admin Dashboard
3. Find the user in the list
4. Click "Terminate"
5. User will no longer be able to login

### View All Users
- Admin Dashboard shows all users with their creation date and status

## Security Tips

- Change your admin password regularly
- Use strong, unique passwords (mix of uppercase, lowercase, numbers, symbols)
- Never share admin credentials
- Monitor user activity through the admin dashboard
- Terminate inactive user accounts

## Troubleshooting

**Can't login after changing credentials?**
- Verify the password hash is correct (use SHA256 generator)
- Check that the username is spelled correctly
- Ensure the document was saved in MongoDB

**Forgot admin password?**
- Access MongoDB Atlas directly
- Update the password_hash field with a new SHA256 hash
- Use the new credentials to login

## Support

For issues or questions, contact your system administrator.
