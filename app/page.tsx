"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Receipt, Download, Shield, Calculator } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Image
                src="/logo.png"
                alt="JH Bridge Translation"
                width={200}
                height={100}
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">JH Bridge Translation</h1>
          <p className="text-xl text-green-600 font-semibold mb-4 italic">
            Breaking Language Barriers for Global Success
          </p>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Quote & Invoice Generator</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Create professional quotes and invoices with modern PDF generation. Streamline your translation business
            documentation process.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-green-200">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Create Quote</CardTitle>
              <CardDescription className="text-slate-600">
                Generate professional quotes for your translation clients with automatic calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/quote">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                  Create New Quote
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Create Invoice</CardTitle>
              <CardDescription className="text-slate-600">
                Generate professional invoices with payment tracking and due dates
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/invoice">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  Create New Invoice
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-slate-600" />
                </div>
                <CardTitle className="text-lg">PDF Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Generate professional, branded PDFs with modern design and automatic calculations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-slate-600" />
                </div>
                <CardTitle className="text-lg">Smart Calculations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Automatic subtotal, tax, and total calculations with customizable tax rates
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-slate-600" />
                </div>
                <CardTitle className="text-lg">Secure Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Protected access with secure authentication to keep your business data safe
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Company Info */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-slate-600">
              <div>
                <p className="font-medium">Phone:</p>
                <p>+1 (774) 223 8771</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>jhbridgetranslation@gmail.com</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-medium">Address:</p>
                <p>500 Grossman Dr, Braintree, MA 02184, United States</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-medium">Website:</p>
                <a
                  href="https://jhbridgetranslation.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  jhbridgetranslation.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
