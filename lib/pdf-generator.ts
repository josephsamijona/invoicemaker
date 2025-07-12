import jsPDF from "jspdf"

// Brand colors
const COLORS = {
  primary: "#2D3748", // Dark navy
  secondary: "#22C55E", // Bright green
  accent: "#3B82F6", // Blue
  text: "#1F2937", // Dark gray
  lightGray: "#F3F4F6", // Light gray
  mediumGray: "#9CA3AF", // Medium gray
  white: "#FFFFFF",
}

interface QuoteData {
  quoteNumber: string
  date: string
  validUntil: string
  clientName: string
  clientEmail: string
  clientAddress: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    amount: number
  }>
  notes: string
  subtotal: number
  taxEnabled: boolean
  taxRate: number
  taxLabel: string
  tax: number
  total: number
}

interface InvoiceData extends Omit<QuoteData, "quoteNumber" | "validUntil"> {
  invoiceNumber: string
  dueDate: string
  status: string
}

// Function to load image as base64
const loadImageAsBase64 = async (imagePath: string): Promise<string> => {
  try {
    const response = await fetch(imagePath)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error("Error loading image:", error)
    return ""
  }
}

export const generateQuotePDF = async (data: QuoteData) => {
  const doc = new jsPDF()

  // Set up fonts
  doc.setFont("helvetica")

  // Header background
  doc.setFillColor(COLORS.primary)
  doc.rect(0, 0, 210, 45, "F")

  // Load and add logo
  try {
    const logoBase64 = await loadImageAsBase64("/logo.png")
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 15, 8, 50, 25)
    }
  } catch (error) {
    console.error("Error adding logo to PDF:", error)
    // Fallback: just add company name text
    doc.setTextColor(COLORS.white)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("JH Bridge Translation", 20, 25)
  }

  // Quote title and slogan
  doc.setTextColor(COLORS.white)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("QUOTE", 170, 20)

  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.text("Breaking Language Barriers", 70, 15)
  doc.text("for Global Success", 70, 20)

  // Reset text color
  doc.setTextColor(COLORS.text)

  // FROM Section - Company Information
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("FROM:", 20, 60)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text("JH Bridge Translation Services", 20, 68)
  doc.text("500 Grossman Dr, Braintree, MA 02184, United States", 20, 73)
  doc.text("Phone: +1 (774) 223 8771", 20, 78)
  doc.text("Email: jhbridgetranslation@gmail.com", 20, 83)
  doc.text("Website: jhbridgetranslation.com", 20, 88)

  // Quote details
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Quote Details", 120, 60)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Quote #: ${data.quoteNumber}`, 120, 68)
  doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 120, 73)
  doc.text(`Valid Until: ${new Date(data.validUntil).toLocaleDateString()}`, 120, 78)

  // TO Section - Client information
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("TO:", 20, 105)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(data.clientName, 20, 113)
  doc.text(data.clientEmail, 20, 118)

  // Split address by lines
  const addressLines = data.clientAddress.split("\n")
  let yPos = 123
  addressLines.forEach((line) => {
    doc.text(line, 20, yPos)
    yPos += 5
  })

  // Items table header
  const tableStartY = Math.max(yPos + 10, 140)

  // Table header background
  doc.setFillColor(COLORS.lightGray)
  doc.rect(20, tableStartY, 170, 8, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("Description", 25, tableStartY + 5)
  doc.text("Qty", 120, tableStartY + 5)
  doc.text("Unit Price", 140, tableStartY + 5)
  doc.text("Amount", 170, tableStartY + 5)

  // Items
  doc.setFont("helvetica", "normal")
  let currentY = tableStartY + 15

  data.items.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 1) {
      doc.setFillColor("#FAFAFA")
      doc.rect(20, currentY - 3, 170, 8, "F")
    }

    doc.setTextColor(COLORS.text)
    doc.text(item.description, 25, currentY)
    doc.text(item.quantity.toString(), 125, currentY)
    doc.text(`$${item.unitPrice.toFixed(2)}`, 145, currentY)
    doc.text(`$${item.amount.toFixed(2)}`, 175, currentY)

    currentY += 10
  })

  // Totals section
  const totalsY = currentY + 10

  // Subtotal
  doc.setFont("helvetica", "normal")
  doc.text("Subtotal:", 140, totalsY)
  doc.text(`$${data.subtotal.toFixed(2)}`, 175, totalsY)

  // Tax (if enabled)
  let taxY = totalsY
  if (data.taxEnabled) {
    taxY += 8
    doc.text(`${data.taxLabel} (${data.taxRate}%):`, 140, taxY)
    doc.text(`$${data.tax.toFixed(2)}`, 175, taxY)
  }

  // Total
  const totalY = taxY + 8
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setFillColor(COLORS.secondary)
  doc.rect(135, totalY - 5, 55, 10, "F")
  doc.setTextColor(COLORS.white)
  doc.text("Total:", 140, totalY)
  doc.text(`$${data.total.toFixed(2)}`, 175, totalY)

  // Notes
  if (data.notes) {
    doc.setTextColor(COLORS.text)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("Notes:", 20, totalY + 20)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const splitNotes = doc.splitTextToSize(data.notes, 170)
    doc.text(splitNotes, 20, totalY + 28)
  }

  // Footer
  const footerY = 280
  doc.setFillColor(COLORS.primary)
  doc.rect(0, footerY, 210, 17, "F")

  doc.setTextColor(COLORS.white)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text("Thank you for choosing JH Bridge Translation!", 20, footerY + 10)
  doc.text("Breaking Language Barriers for Global Success", 120, footerY + 10)

  // Save the PDF
  doc.save(`quote-${data.quoteNumber}.pdf`)
}

export const generateInvoicePDF = async (data: InvoiceData) => {
  const doc = new jsPDF()

  // Set up fonts
  doc.setFont("helvetica")

  // Header background
  doc.setFillColor(COLORS.primary)
  doc.rect(0, 0, 210, 45, "F")

  // Load and add logo
  try {
    const logoBase64 = await loadImageAsBase64("/logo.png")
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 15, 8, 50, 25)
    }
  } catch (error) {
    console.error("Error adding logo to PDF:", error)
    // Fallback: just add company name text
    doc.setTextColor(COLORS.white)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("JH Bridge Translation", 20, 25)
  }

  // Invoice title and slogan
  doc.setTextColor(COLORS.white)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("INVOICE", 165, 20)

  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.text("Breaking Language Barriers", 70, 15)
  doc.text("for Global Success", 70, 20)

  // Reset text color
  doc.setTextColor(COLORS.text)

  // FROM Section - Company Information
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("FROM:", 20, 60)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text("JH Bridge Translation Services", 20, 68)
  doc.text("500 Grossman Dr, Braintree, MA 02184, United States", 20, 73)
  doc.text("Phone: +1 (774) 223 8771", 20, 78)
  doc.text("Email: jhbridgetranslation@gmail.com", 20, 83)
  doc.text("Website: jhbridgetranslation.com", 20, 88)

  // Invoice details
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Invoice Details", 120, 60)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Invoice #: ${data.invoiceNumber}`, 120, 68)
  doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`, 120, 73)
  doc.text(`Due Date: ${new Date(data.dueDate).toLocaleDateString()}`, 120, 78)

  // Status badge
  const statusColors = {
    paid: COLORS.secondary,
    pending: "#F59E0B",
    overdue: "#EF4444",
  }

  doc.setFillColor(statusColors[data.status as keyof typeof statusColors] || statusColors.pending)
  doc.rect(120, 82, 30, 6, "F")
  doc.setTextColor(COLORS.white)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.text(data.status.toUpperCase(), 125, 86)

  // Reset text color
  doc.setTextColor(COLORS.text)

  // TO Section - Client information
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("TO:", 20, 105)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(data.clientName, 20, 113)
  doc.text(data.clientEmail, 20, 118)

  // Split address by lines
  const addressLines = data.clientAddress.split("\n")
  let yPos = 123
  addressLines.forEach((line) => {
    doc.text(line, 20, yPos)
    yPos += 5
  })

  // Items table header
  const tableStartY = Math.max(yPos + 10, 140)

  // Table header background
  doc.setFillColor(COLORS.lightGray)
  doc.rect(20, tableStartY, 170, 8, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("Description", 25, tableStartY + 5)
  doc.text("Qty", 120, tableStartY + 5)
  doc.text("Unit Price", 140, tableStartY + 5)
  doc.text("Amount", 170, tableStartY + 5)

  // Items
  doc.setFont("helvetica", "normal")
  let currentY = tableStartY + 15

  data.items.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 1) {
      doc.setFillColor("#FAFAFA")
      doc.rect(20, currentY - 3, 170, 8, "F")
    }

    doc.setTextColor(COLORS.text)
    doc.text(item.description, 25, currentY)
    doc.text(item.quantity.toString(), 125, currentY)
    doc.text(`$${item.unitPrice.toFixed(2)}`, 145, currentY)
    doc.text(`$${item.amount.toFixed(2)}`, 175, currentY)

    currentY += 10
  })

  // Totals section
  const totalsY = currentY + 10

  // Subtotal
  doc.setFont("helvetica", "normal")
  doc.text("Subtotal:", 140, totalsY)
  doc.text(`$${data.subtotal.toFixed(2)}`, 175, totalsY)

  // Tax (if enabled)
  let taxY = totalsY
  if (data.taxEnabled) {
    taxY += 8
    doc.text(`${data.taxLabel} (${data.taxRate}%):`, 140, taxY)
    doc.text(`$${data.tax.toFixed(2)}`, 175, taxY)
  }

  // Total
  const totalY = taxY + 8
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setFillColor(COLORS.accent)
  doc.rect(135, totalY - 5, 55, 10, "F")
  doc.setTextColor(COLORS.white)
  doc.text("Total:", 140, totalY)
  doc.text(`$${data.total.toFixed(2)}`, 175, totalY)

  // Payment information
  doc.setTextColor(COLORS.text)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.text("Payment Information:", 20, totalY + 20)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text("Please remit payment within 30 days of invoice date.", 20, totalY + 28)
  doc.text("Wire Transfer: Contact us for banking details", 20, totalY + 33)
  doc.text("PayPal: jhbridgetranslation@gmail.com", 20, totalY + 38)
  doc.text("Check: Make payable to JH Bridge Translation", 20, totalY + 43)

  // Notes
  if (data.notes) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.text("Additional Notes:", 20, totalY + 55)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    const splitNotes = doc.splitTextToSize(data.notes, 170)
    doc.text(splitNotes, 20, totalY + 63)
  }

  // Footer
  const footerY = 280
  doc.setFillColor(COLORS.primary)
  doc.rect(0, footerY, 210, 17, "F")

  doc.setTextColor(COLORS.white)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text("Thank you for choosing JH Bridge Translation!", 20, footerY + 10)
  doc.text("Breaking Language Barriers for Global Success", 120, footerY + 10)

  // Save the PDF
  doc.save(`invoice-${data.invoiceNumber}.pdf`)
}
