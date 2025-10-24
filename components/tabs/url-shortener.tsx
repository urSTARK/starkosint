"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Copy, Check } from "lucide-react"
import { playSuccessSound, playErrorSound } from "@/components/sound-notification"

export function UrlShortener() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: "url", params: { query } }),
      })

      if (!response.ok) throw new Error("Failed")

      const data = await response.json()
      setResult(data.short_url || "Unable to shorten URL")
      playSuccessSound()

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (err) {
      setError("Failed to shorten URL")
      playErrorSound()
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleShorten} className="flex gap-2">
        <input
          type="url"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter URL to shorten..."
          className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Shorten
        </button>
      </form>

      {error && <div className="p-4 bg-error/10 border border-error rounded-lg text-error">{error}</div>}

      {result && (
        <div ref={resultRef} className="p-6 bg-background border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-accent">Shortened URL</h3>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-3 bg-muted rounded text-sm text-muted-foreground break-all">{result}</code>
            <button onClick={copyToClipboard} className="p-2 hover:bg-muted rounded transition-colors">
              {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
