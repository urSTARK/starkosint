"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { LoginPanel } from "@/components/login-panel"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ThemeToggle } from "@/components/theme-toggle"
import { PersonalSearch } from "@/components/tabs/personal-search"
import { EmailSearch } from "@/components/tabs/email-search"
import { UsernameSearch } from "@/components/tabs/username-search"
import { VehicleSearch } from "@/components/tabs/vehicle-search"
import { IpSearch } from "@/components/tabs/ip-search"
import { PostalSearch } from "@/components/tabs/postal-search"
import { MacSearch } from "@/components/tabs/mac-search"
import { IfscSearch } from "@/components/tabs/ifsc-search"
import { BinSearch } from "@/components/tabs/bin-search"
import { GithubSearch } from "@/components/tabs/github-search"
import { BanSearch } from "@/components/tabs/ban-search"
import { DomainSearch } from "@/components/tabs/domain-search"
import { CryptoSearch } from "@/components/tabs/crypto-search"
import { WeatherSearch } from "@/components/tabs/weather-search"
import { UrlShortener } from "@/components/tabs/url-shortener"
import { Contact } from "@/components/contact"
import { LogOut, ChevronDown } from "lucide-react"

type TabType =
  | "personal"
  | "email"
  | "username"
  | "vehicle"
  | "ip"
  | "postal"
  | "mac"
  | "ifsc"
  | "bin"
  | "github"
  | "ban"
  | "domain"
  | "crypto"
  | "weather"
  | "url"

const tabs: { id: TabType; label: string; category: string }[] = [
  { id: "personal", label: "Personal", category: "Personal" },
  { id: "email", label: "Email Search", category: "Personal" },
  { id: "username", label: "Username Search", category: "Personal" },
  { id: "vehicle", label: "Vehicle", category: "Vehicle" },
  { id: "ip", label: "IP Lookup", category: "Network" },
  { id: "postal", label: "Postal", category: "Location" },
  { id: "mac", label: "MAC Address", category: "Network" },
  { id: "ifsc", label: "IFSC Code", category: "Banking" },
  { id: "bin", label: "BIN Lookup", category: "Banking" },
  { id: "github", label: "GitHub", category: "Social" },
  { id: "ban", label: "Ban Check", category: "Verification" },
  { id: "domain", label: "Domain", category: "Web" },
  { id: "crypto", label: "Crypto Price", category: "Finance" },
  { id: "weather", label: "Weather", category: "Location" },
  { id: "url", label: "URL Shortener", category: "Web" },
]

export default function Home() {
  const { isAuthenticated, username, isAdmin, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("personal")
  const [showContact, setShowContact] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("Personal")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  if (!isAuthenticated) {
    return <LoginPanel />
  }

  if (isAdmin) {
    return <AdminDashboard />
  }

  const categories = Array.from(new Set(tabs.map((t) => t.category)))
  const categoryTabs = tabs.filter((t) => t.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Stark OSINT
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, <span className="font-semibold text-foreground">{username}</span>
              </span>
              <button
                onClick={() => setShowContact(true)}
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </button>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Category Dropdown */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Category:</span>
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors flex items-center gap-2 border border-border"
              >
                {selectedCategory}
                <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
              </button>

              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-muted border border-border rounded-lg shadow-lg z-10">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        setShowCategoryDropdown(false)
                        // Set active tab to first tab in category
                        const firstTabInCategory = tabs.find((t) => t.category === category)
                        if (firstTabInCategory) {
                          setActiveTab(firstTabInCategory.id)
                        }
                      }}
                      className={`w-full text-left px-4 py-2 transition-colors ${
                        selectedCategory === category ? "bg-primary text-white" : "text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Horizontal Tabs */}
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg shadow-primary/50"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-12 bg-muted/50 rounded-xl border border-border p-8">
          {activeTab === "personal" && <PersonalSearch />}
          {activeTab === "email" && <EmailSearch />}
          {activeTab === "username" && <UsernameSearch />}
          {activeTab === "vehicle" && <VehicleSearch />}
          {activeTab === "ip" && <IpSearch />}
          {activeTab === "postal" && <PostalSearch />}
          {activeTab === "mac" && <MacSearch />}
          {activeTab === "ifsc" && <IfscSearch />}
          {activeTab === "bin" && <BinSearch />}
          {activeTab === "github" && <GithubSearch />}
          {activeTab === "ban" && <BanSearch />}
          {activeTab === "domain" && <DomainSearch />}
          {activeTab === "crypto" && <CryptoSearch />}
          {activeTab === "weather" && <WeatherSearch />}
          {activeTab === "url" && <UrlShortener />}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-xl">
          <h3 className="text-sm font-semibold text-primary mb-3">Disclaimer</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This tool is provided for educational and authorized research purposes only. All data displayed through this
            platform is publicly available information sourced from the internet. The owner and developers of Stark
            OSINT are not responsible for any misuse, illegal activities, or unauthorized access to personal
            information. Users are solely responsible for ensuring their use of this tool complies with all applicable
            laws and regulations. Unauthorized access to computer systems or personal data is illegal. By using this
            tool, you agree to use it responsibly and ethically.
          </p>
        </div>
      </main>

      {/* Contact Modal */}
      {showContact && <Contact onClose={() => setShowContact(false)} />}
    </div>
  )
}
