"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { generateQuotePDF } from "@/lib/pdf-generator"
import SecurityGate from "@/components/security-gate"

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface QuoteData {
  quoteNumber: string
  date: string
  validUntil: string
  clientName: string
  clientEmail: string
  clientAddress: string
  items: QuoteItem[]
  notes: string
  subtotal: number
  taxEnabled: boolean
  taxRate: number
  taxLabel: string
  tax: number
  total: number
}

export default function QuotePage() {
  const [quoteData, setQuoteData] = useState<QuoteData>({
    quoteNumber: `QUO-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    items: [{ id: "1", description: "", quantity: 1, unitPrice: 0, amount: 0 }],
    notes: "",
    subtotal: 0,
    taxEnabled: true,
    taxRate: 10,
    taxLabel: "Tax",
    tax: 0,
    total: 0,
  })

  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    updateCalculations()
  }, [quoteData.items, quoteData.taxEnabled, quoteData.taxRate])

  const updateCalculations = () => {
    const subtotal = quoteData.items.reduce((sum, item) => sum + item.amount, 0)
    const tax = quoteData.taxEnabled ? subtotal * (quoteData.taxRate / 100) : 0
    const total = subtotal + tax

    setQuoteData((prev) => ({
      ...prev,
      subtotal,
      tax,
      total,
    }))
  }

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    }
    setQuoteData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const removeItem = (id: string) => {
    setQuoteData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setQuoteData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      }),
    }))
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      await generateQuotePDF(quoteData)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <SecurityGate>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Create Quote</h1>
                <p className="text-slate-600">Generate a professional quote for your client</p>
              </div>
            </div>
            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate PDF"}
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Quote Details */}
            <Card>
              <CardHeader>
                <CardTitle>Quote Details</CardTitle>
                <CardDescription>Basic information about this quote</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quoteNumber">Quote Number</Label>
                    <Input
                      id="quoteNumber"
                      value={quoteData.quoteNumber}
                      onChange={(e) => setQuoteData((prev) => ({ ...prev, quoteNumber: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={quoteData.date}
                      onChange={(e) => setQuoteData((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={quoteData.validUntil}
                    onChange={(e) => setQuoteData((prev) => ({ ...prev, validUntil: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Details about your client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    value={quoteData.clientName}
                    onChange={(e) => setQuoteData((prev) => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={quoteData.clientEmail}
                    onChange={(e) => setQuoteData((prev) => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="client@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="clientAddress">Client Address</Label>
                  <Textarea
                    id="clientAddress"
                    value={quoteData.clientAddress}
                    onChange={(e) => setQuoteData((prev) => ({ ...prev, clientAddress: e.target.value }))}
                    placeholder="Enter client address"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items */}
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Items</CardTitle>
                  <CardDescription>Add items to your quote</CardDescription>
                </div>
                <Button onClick={addItem} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quoteData.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                    <div className="col-span-5">
                      <Label>Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Amount</Label>
                      <Input value={`$${item.amount.toFixed(2)}`} readOnly className="bg-slate-50" />
                    </div>
                    <div className="col-span-1">
                      {quoteData.items.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* Tax Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Settings</CardTitle>
                <CardDescription>Configure tax calculations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="taxEnabled"
                    checked={quoteData.taxEnabled}
                    onCheckedChange={(checked) => setQuoteData((prev) => ({ ...prev, taxEnabled: checked as boolean }))}
                  />
                  <Label htmlFor="taxEnabled">Apply tax</Label>
                </div>
                {quoteData.taxEnabled && (
                  <>
                    <div>
                      <Label htmlFor="taxLabel">Tax Label</Label>
                      <Input
                        id="taxLabel"
                        value={quoteData.taxLabel}
                        onChange={(e) => setQuoteData((prev) => ({ ...prev, taxLabel: e.target.value }))}
                        placeholder="e.g., VAT, Sales Tax"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={quoteData.taxRate}
                        onChange={(e) =>
                          setQuoteData((prev) => ({ ...prev, taxRate: Number.parseFloat(e.target.value) || 0 }))
                        }
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Totals */}
            <Card>
              <CardHeader>
                <CardTitle>Quote Summary</CardTitle>
                <CardDescription>Calculated totals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">${quoteData.subtotal.toFixed(2)}</span>
                </div>
                {quoteData.taxEnabled && (
                  <div className="flex justify-between">
                    <span>
                      {quoteData.taxLabel} ({quoteData.taxRate}%):
                    </span>
                    <span className="font-medium">${quoteData.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${quoteData.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Terms, conditions, or additional information</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={quoteData.notes}
                onChange={(e) => setQuoteData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter any additional notes, terms, or conditions..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </SecurityGate>
  )
}
