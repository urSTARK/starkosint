"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Lock, User } from "lucide-react"

export function LoginPanel() {
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const success = await login(username, password)
    if (!success) {
      setError("Invalid username or password")
      setPassword("")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Stark OSINT</h1>
          <p className="text-muted-foreground">Intelligence Gathering Tool</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-muted border border-border rounded-xl p-8 space-y-6 shadow-xl">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-primary/10 border border-primary rounded-lg text-primary text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className="w-full py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Contact your administrator for login credentials
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>This is a protected OSINT tool. Login required to access.</p>
        </div>
      </div>
    </div>
  )
}
