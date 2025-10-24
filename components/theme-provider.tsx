"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem("theme") || "dark"
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [])

  if (!mounted) return null

  return <>{children}</>
}
