"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff, LogOut } from "lucide-react"

interface SecurityGateProps {
  children: React.ReactNode
}

export default function SecurityGate({ children }: SecurityGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const CORRECT_CODE = "zxcvbnm" // Updated access code

  useEffect(() => {
    // Check if user is already authenticated
    const stored = localStorage.getItem("app_authenticated")
    if (stored === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (accessCode === CORRECT_CODE) {
      setIsAuthenticated(true)
      localStorage.setItem("app_authenticated", "true")
    } else {
      setError("Invalid access code. Please try again.")
      setAccessCode("")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("app_authenticated")
    setAccessCode("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-slate-600" />
            </div>
            <CardTitle className="text-2xl">Secure Access Required</CardTitle>
            <CardDescription>Please enter your access code to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accessCode">Access Code</Label>
                <div className="relative">
                  <Input
                    id="accessCode"
                    type={showPassword ? "text" : "password"}
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter access code"
                    className={error ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full">
                Access Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button variant="outline" size="sm" onClick={handleLogout} className="bg-white/80 backdrop-blur-sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      {children}
    </div>
  )
}
