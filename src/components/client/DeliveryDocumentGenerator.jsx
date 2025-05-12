import { useState, useRef } from "react"
import DeliveryDocument from "./DeliveryDocument"

const DeliveryDocumentGenerator = ({ order }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const printFrameRef = useRef(null)

  // Function to handle printing using browser's native print functionality
  const handlePrint = () => {
    setIsLoading(true)
    
    // Make sure the document is visible
    setShowPreview(true)
    
    // Give the browser a moment to render the document
    setTimeout(() => {
      try {
        // Create a new window for printing
        const printWindow = window.open('', '_blank', 'width=800,height=600')
        
        if (!printWindow) {
          alert("Please allow pop-ups to print the document")
          setIsLoading(false)
          return
        }
        
        // Write the document content to the new window
        printWindow.document.write(`
          <html>
            <head>
              <title>Delivery Document ${order.order_number || ''}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                }
                .print-container {
                  padding: 20px;
                }
                @media print {
                  body {
                    margin: 0;
                    padding: 0;
                  }
                  .print-container {
                    padding: 0;
                  }
                  @page {
                    size: A4;
                    margin: 0.5cm;
                  }
                }
                /* Copy all styles from your document */
                .border-2 { border-width: 2px; }
                .border-gray-800 { border-color: #2d3748; }
                .p-6 { padding: 1.5rem; }
                .p-8 { padding: 2rem; }
                .mb-8 { margin-bottom: 2rem; }
                .mb-4 { margin-bottom: 1rem; }
                .pb-4 { padding-bottom: 1rem; }
                .border-b { border-bottom-width: 1px; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .items-center { align-items: center; }
                .text-3xl { font-size: 1.875rem; }
                .text-xl { font-size: 1.25rem; }
                .font-bold { font-weight: 700; }
                .font-semibold { font-weight: 600; }
                .text-gray-800 { color: #2d3748; }
                .text-gray-600 { color: #4b5563; }
                .text-gray-700 { color: #374151; }
                .text-right { text-align: right; }
                .grid { display: grid; }
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .gap-6 { gap: 1.5rem; }
                .w-full { width: 100%; }
                .text-left { text-align: left; }
                .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .w-32 { width: 8rem; }
                .h-32 { height: 8rem; }
                .mt-8 { margin-top: 2rem; }
                .pt-4 { padding-top: 1rem; }
                .text-sm { font-size: 0.875rem; }
                .border-2 { border-width: 2px; }
                .border-gray-400 { border-color: #cbd5e0; }
                .bg-gray-100 { background-color: #f7fafc; }
                .text-xs { font-size: 0.75rem; }
                .text-center { text-align: center; }
                .text-gray-500 { color: #6b7280; }
                .p-2 { padding: 0.5rem; }
                table { border-collapse: collapse; width: 100%; }
                th, td { padding: 8px; text-align: left; }
                tr.border-b { border-bottom: 1px solid #e2e8f0; }
              </style>
            </head>
            <body>
              <div class="print-container">
                ${document.getElementById('delivery-document-content').innerHTML}
              </div>
              <script>
                // Auto print when loaded
                window.onload = function() {
                  window.print();
                  // Close the window after printing (or if print is cancelled)
                  window.setTimeout(function() {
                    window.close();
                  }, 500);
                };
              </script>
            </body>
          </html>
        `)
        
        printWindow.document.close()
      } catch (error) {
        console.error("Printing failed:", error)
        alert("Printing failed. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  // Function to generate PDF using browser print to PDF feature
  const generatePdf = () => {
    handlePrint()
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={generatePdf}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300"
        >
          {isLoading ? "Processing..." : "Generate PDF"}
        </button>
        <button
          onClick={handlePrint}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? "Processing..." : "Print Document"}
        </button>
        <button
          onClick={togglePreview}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {/* Document preview */}
      <div 
        style={{ display: showPreview ? "block" : "none" }}
        id="delivery-document-content"
      >
        <DeliveryDocument order={order} />
      </div>
      
      {/* Hidden iframe for printing (alternative method) */}
      <iframe 
        ref={printFrameRef}
        style={{ display: 'none' }}
        title="Print Frame"
      />
    </div>
  )
}

export default DeliveryDocumentGenerator
