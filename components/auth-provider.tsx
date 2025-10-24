"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  username: string | null
  isAdmin: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedAuth = localStorage.getItem("starkAuth")
    if (storedAuth) {
      const { username: storedUsername, isAdmin: storedIsAdmin } = JSON.parse(storedAuth)
      setUsername(storedUsername)
      setIsAdmin(storedIsAdmin)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) return false

      const data = await response.json()
      const isAdminUser = username === "admin"

      localStorage.setItem("starkAuth", JSON.stringify({ username: data.username, isAdmin: isAdminUser }))
      setUsername(data.username)
      setIsAdmin(isAdminUser)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("starkAuth")
    setUsername(null)
    setIsAdmin(false)
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
