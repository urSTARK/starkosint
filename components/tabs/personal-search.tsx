"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Search, Copy, Check } from "lucide-react"
import { callApi, formatApiResponse } from "@/lib/api-utils"
import { playSuccessSound, playErrorSound } from "@/components/sound-notification"

export function PersonalSearch() {
  const [searchType, setSearchType] = useState<"aadhaar" | "phone" | "family" | "mobile">("phone")
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<string | null>(null)
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
      const data = await callApi("personal", { type: searchType, query })
      const formatted = formatApiResponse(data)
      setResult(formatted)
      playSuccessSound()

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (err) {
      setError("No data found or API error")
      playErrorSound()
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {(["aadhaar", "phone", "family", "mobile"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSearchType(type)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                searchType === type ? "bg-accent text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Enter ${searchType}...`}
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
      </div>

      {error && <div className="p-4 bg-error/10 border border-error rounded-lg text-error">{error}</div>}

      {result && (
        <div ref={resultRef} className="p-6 bg-background border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-accent">Results</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy JSON
                </>
              )}
            </button>
          </div>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap break-words font-mono bg-muted p-4 rounded overflow-auto max-h-96">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
