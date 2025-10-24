"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Search, Copy, Check } from "lucide-react"
import { playSuccessSound, playErrorSound } from "@/components/sound-notification"

export function WeatherSearch() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: "weather", params: { query } }),
      })

      if (!response.ok) throw new Error("Failed")

      const data = await response.json()
      setResult(data)
      playSuccessSound()

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (err) {
      setError("No weather data found")
      playErrorSound()
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    const text = JSON.stringify(result, null, 2)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter city name..."
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-accent">Weather Information</h3>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy JSON
                </>
              )}
            </button>
          </div>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap break-words font-mono bg-muted/50 p-4 rounded-lg overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
