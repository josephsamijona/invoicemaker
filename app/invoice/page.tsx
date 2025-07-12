"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Receipt, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { generateInvoicePDF } from "@/lib/pdf-generator"
import SecurityGate from "@/components/security-gate"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  status: string
  clientName: string
  clientEmail: string
  clientAddress: string
  items: InvoiceItem[]
  notes: string
  subtotal: number
  taxEnabled: boolean
  taxRate: number
  taxLabel: string
  tax: number
  total: number
}

export default function InvoicePage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "pending",
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
  }, [invoiceData.items, invoiceData.taxEnabled, invoiceData.taxRate])

  const updateCalculations = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0)
    const tax = invoiceData.taxEnabled ? subtotal * (invoiceData.taxRate / 100) : 0
    const total = subtotal + tax

    setInvoiceData((prev) => ({
      ...prev,
      subtotal,
      tax,
      total,
    }))
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    }
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const removeItem = (id: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceData((prev) => ({
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
      await generateInvoicePDF(invoiceData)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-50 border-green-200"
      case "overdue":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
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
                <h1 className="text-3xl font-bold text-slate-900">Create Invoice</h1>
                <p className="text-slate-600">Generate a professional invoice for your client</p>
              </div>
            </div>
            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Receipt className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate PDF"}
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>Basic information about this invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={invoiceData.status}
                      onValueChange={(value) => setInvoiceData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Invoice Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData((prev) => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div
                  className={`px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor(invoiceData.status)}`}
                >
                  Status: {invoiceData.status.charAt(0).toUpperCase() + invoiceData.status.slice(1)}
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
                    value={invoiceData.clientName}
                    onChange={(e) => setInvoiceData((prev) => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={invoiceData.clientEmail}
                    onChange={(e) => setInvoiceData((prev) => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="client@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="clientAddress">Client Address</Label>
                  <Textarea
                    id="clientAddress"
                    value={invoiceData.clientAddress}
                    onChange={(e) => setInvoiceData((prev) => ({ ...prev, clientAddress: e.target.value }))}
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
                  <CardDescription>Add items to your invoice</CardDescription>
                </div>
                <Button onClick={addItem} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoiceData.items.map((item, index) => (
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
                      {invoiceData.items.length > 1 && (
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
                    checked={invoiceData.taxEnabled}
                    onCheckedChange={(checked) =>
                      setInvoiceData((prev) => ({ ...prev, taxEnabled: checked as boolean }))
                    }
                  />
                  <Label htmlFor="taxEnabled">Apply tax</Label>
                </div>
                {invoiceData.taxEnabled && (
                  <>
                    <div>
                      <Label htmlFor="taxLabel">Tax Label</Label>
                      <Input
                        id="taxLabel"
                        value={invoiceData.taxLabel}
                        onChange={(e) => setInvoiceData((prev) => ({ ...prev, taxLabel: e.target.value }))}
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
                        value={invoiceData.taxRate}
                        onChange={(e) =>
                          setInvoiceData((prev) => ({ ...prev, taxRate: Number.parseFloat(e.target.value) || 0 }))
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
                <CardTitle>Invoice Summary</CardTitle>
                <CardDescription>Calculated totals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">${invoiceData.subtotal.toFixed(2)}</span>
                </div>
                {invoiceData.taxEnabled && (
                  <div className="flex justify-between">
                    <span>
                      {invoiceData.taxLabel} ({invoiceData.taxRate}%):
                    </span>
                    <span className="font-medium">${invoiceData.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${invoiceData.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Payment terms, conditions, or additional information</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter payment terms, conditions, or additional information..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </SecurityGate>
  )
}
