import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'

function App() {
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [color, setColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const qrRef = useRef(null)

  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg')
    if (!svg) return

    // Create canvas from SVG
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = size
    canvas.height = size

    // Fill background
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, size, size)

    // Convert SVG to data URL and draw on canvas
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size)
      URL.revokeObjectURL(url)
      
      // Download
      const link = document.createElement('a')
      link.download = `qrcode-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = url
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Free QR Code Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create QR codes instantly for websites, WiFi, contacts, payments, events. 
            No signup. Download PNG/SVG. Works offline.
          </p>
        </header>

        <main className="grid md:grid-cols-2 gap-12 items-center">
          {/* Input Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter URL, Text, WiFi, Contact, or Payment info:
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://yourwebsite.com or My WiFi: NetworkName or +1234567890"
                className="w-full p-5 border-2 border-gray-200 rounded-2xl text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-200 resize-none"
              />
            </div>

            {/* Size Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
                QR Size: <span className="font-mono text-lg">{size}px</span>
              </label>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-600"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">QR Color:</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-12 p-1 border-2 border-gray-200 rounded-xl cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Background:</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-12 p-1 border-2 border-gray-200 rounded-xl cursor-pointer"
                />
              </div>
            </div>

            {/* Action Buttons */}
            {text && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <button
                  onClick={downloadQR}
                  className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-5 px-8 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  📱 Download PNG
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(text)}
                  className="border-2 border-dashed border-indigo-400 hover:border-indigo-500 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-5 px-8 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3"
                >
                  📋 Copy Text
                </button>
              </div>
            )}
          </div>

          {/* QR Display - FIXED */}
          <div className="flex flex-col items-center">
            {text ? (
              <>
                <div className="p-8 bg-white rounded-3xl shadow-2xl border-4 border-gray-100 mb-6">
                  <div ref={qrRef} className="flex justify-center">
                    <QRCodeSVG
                      value={text}
                      size={size}
                      color={color}
                      bgColor={bgColor}
                      style={{ display: 'block' }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  Scan this QR code with any smartphone camera
                </p>
              </>
            ) : (
              <div className="w-full h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">📱</span>
                  </div>
                  <p className="text-gray-500 font-medium">Enter text above to generate QR</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* SEO Footer */}
        <footer className="mt-24 text-center text-sm text-gray-500 space-y-4">
          <div>
            <strong>Free QR Code Generator</strong> - No signup, no limits, instant download
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <span>WiFi QR Code</span>
            <span>URL QR Code</span>
            <span>vCard QR Code</span>
            <span>Payment QR Code</span>
            <span>Event QR Code</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
