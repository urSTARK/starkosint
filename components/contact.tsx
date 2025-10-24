"use client"

import { X, MessageCircle, Send } from "lucide-react"

interface ContactProps {
  onClose: () => void
}

export function Contact({ onClose }: ContactProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-muted border border-border rounded-xl max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Contact Developer</h2>
          <button onClick={onClose} className="p-1 hover:bg-background rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-background rounded-lg border border-border">
            <h3 className="font-semibold text-primary mb-2">Telegram</h3>
            <a
              href="https://t.me/urSTARKz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              @urSTARKz
            </a>
          </div>

          <div className="p-4 bg-background rounded-lg border border-border">
            <h3 className="font-semibold text-primary mb-2">Instagram</h3>
            <a
              href="https://instagram.com/urstarkz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              @urstarkz
            </a>
          </div>

          <div className="p-4 bg-background rounded-lg border border-border">
            <h3 className="font-semibold text-primary mb-2">WhatsApp</h3>
            <a
              href="https://wa.me/+201121417464"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              +20 112 141 7464
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
