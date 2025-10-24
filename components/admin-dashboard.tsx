"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, Plus, LogOut, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface User {
  id: string
  username: string
  is_active: boolean
  created_at: string
  terminated_at: string | null
}

export function AdminDashboard() {
  const { logout } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showTerminated, setShowTerminated] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!newUsername.trim() || !newPassword.trim()) {
      setError("Username and password required")
      return
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create user")
      }

      setSuccess("User created successfully")
      setNewUsername("")
      setNewPassword("")
      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user")
    }
  }

  const terminateUser = async (userId: string) => {
    if (!confirm("Are you sure you want to terminate this user?")) return

    try {
      const response = await fetch(`/api/admin/users/${userId}/terminate`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to terminate user")

      setSuccess("User terminated successfully")
      fetchUsers()
    } catch (err) {
      setError("Failed to terminate user")
    }
  }

  const deleteTerminatedUser = async (userId: string) => {
    if (!confirm("Permanently delete this terminated user? This cannot be undone.")) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete user")

      setSuccess("User permanently deleted")
      fetchUsers()
    } catch (err) {
      setError("Failed to delete user")
    }
  }

  const displayedUsers = showTerminated ? users : users.filter((user) => user.is_active)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Create User Section */}
        <div className="bg-muted/50 border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New User</h2>
          <form onSubmit={createUser} className="flex gap-3 flex-wrap">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Username"
              className="flex-1 min-w-48 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password"
              className="flex-1 min-w-48 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create User
            </button>
          </form>
        </div>

        {/* Messages */}
        {error && <div className="p-4 bg-error/10 border border-error rounded-lg text-error mb-6">{error}</div>}
        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-500 mb-6">{success}</div>
        )}

        {/* Users Table */}
        <div className="bg-muted/50 border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between">
            <h3 className="font-semibold">Users</h3>
            <button
              onClick={() => setShowTerminated(!showTerminated)}
              className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors flex items-center gap-2"
            >
              {showTerminated ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showTerminated ? "Hide Terminated" : "Show Terminated"}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold">Username</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      Loading users...
                    </td>
                  </tr>
                ) : displayedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      {showTerminated ? "No terminated users" : "No active users"}
                    </td>
                  </tr>
                ) : (
                  displayedUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{user.username}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.is_active ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {user.is_active ? "Active" : "Terminated"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {user.is_active && user.username !== "admin" && (
                          <button
                            onClick={() => terminateUser(user.id)}
                            className="px-3 py-1.5 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Terminate
                          </button>
                        )}
                        {!user.is_active && user.username !== "admin" && (
                          <button
                            onClick={() => deleteTerminatedUser(user.id)}
                            className="px-3 py-1.5 text-sm bg-red-600/30 hover:bg-red-600/50 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
