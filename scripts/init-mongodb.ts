import { MongoClient } from "mongodb"
import { hashPassword } from "@/lib/auth-utils"

const MONGODB_URI = "mongodb+srv://urstark:unrucgfS4hw2R99h@cluster0.avdjjhi.mongodb.net/?appName=Cluster0"

async function initializeDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("starkosint")

    // Create users collection if it doesn't exist
    const collections = await db.listCollections().toArray()
    const usersCollectionExists = collections.some((col) => col.name === "users")

    if (!usersCollectionExists) {
      await db.createCollection("users")
      console.log("✓ Created users collection")
    }

    // Create unique index on username
    await db.collection("users").createIndex({ username: 1 }, { unique: true })
    console.log("✓ Created unique index on username")

    // Check if admin user exists
    const adminUser = await db.collection("users").findOne({ username: "admin" })

    if (!adminUser) {
      // Create default admin user
      const adminPasswordHash = hashPassword("admin123")
      await db.collection("users").insertOne({
        username: "admin",
        password_hash: adminPasswordHash,
        is_active: true,
        created_at: new Date(),
        created_by: "system",
        terminated_at: null,
        terminated_by: null,
      })
      console.log("✓ Created default admin user (admin/admin123)")
    } else {
      console.log("✓ Admin user already exists")
    }

    console.log("\n✓ MongoDB initialization complete!")
  } catch (error) {
    console.error("Error initializing database:", error)
  } finally {
    await client.close()
  }
}

initializeDatabase()
