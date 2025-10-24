"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Search } from "lucide-react"
import { callApi, formatApiResponse } from "@/lib/api-utils"
import { playSuccessSound, playErrorSound } from "@/components/sound-notification"

export function VehicleSearch() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await callApi("vehicle", { query })
      const formatted = formatApiResponse(data, "vehicle")
      setResult(formatted)
      playSuccessSound()

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (err) {
      setError("No vehicle data found")
      playErrorSound()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter registration number (e.g., MH12AB1234)..."
          className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {error && <div className="p-4 bg-error/10 border border-error rounded-lg text-error">{error}</div>}

      {result && (
        <div ref={resultRef} className="p-6 bg-background border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-accent">Vehicle Information</h3>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap break-words font-mono">{result}</pre>
        </div>
      )}
    </div>
  )
}
