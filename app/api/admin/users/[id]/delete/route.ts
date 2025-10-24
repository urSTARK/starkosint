import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Verify user is terminated before deleting
    const user = await db.collection("users").findOne({
      _id: new ObjectId(id),
      is_active: false,
    })

    if (!user) {
      return NextResponse.json({ error: "User not found or is still active" }, { status: 404 })
    }

    // Prevent deleting admin user
    if (user.username === "admin") {
      return NextResponse.json({ error: "Cannot delete admin user" }, { status: 403 })
    }

    // Delete the user
    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "User permanently deleted" })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
