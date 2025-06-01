import { useState, useRef, useEffect } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'
import './App.css'

function App() {
  const [isScanning, setIsScanning] = useState(false)
  const [codeData, setCodeData] = useState(null)
  const videoRef = useRef(null)
  const codeReader = useRef(new BrowserMultiFormatReader())

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      if (isScanning) {
        stopScanning()
      }
    }
  }, [])

  const startScanning = async () => {
    try {
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices()
      const selectedDeviceId = videoInputDevices[0].deviceId
      
      setIsScanning(true)
      setCodeData(null)

      codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            setCodeData({
              text: result.getText(),
              format: result.getBarcodeFormat()
            })
          }
          if (err && !(err instanceof Error)) {
            console.error(err)
          }
        }
      )
    } catch (err) {
      console.error('Error starting camera:', err)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    codeReader.current.reset()
    setIsScanning(false)
  }

  return (
    <div className="app-container">
      <h1>Code Reader</h1>
      
      <div className="video-container">
        <video ref={videoRef} className="video-viewer" />
      </div>

      <div className="controls">
        <button 
          onClick={startScanning} 
          disabled={isScanning}
          className="control-button start"
        >
          Start Camera
        </button>
        <button 
          onClick={stopScanning} 
          disabled={!isScanning}
          className="control-button stop"
        >
          Stop Camera
        </button>
      </div>

      <div className="code-info">
        <h2>Code Information</h2>
        {codeData ? (
          <div className="code-data">
            <p><strong>Content:</strong> {codeData.text}</p>
            <p><strong>Format:</strong> {codeData.format}</p>
          </div>
        ) : (
          <p className="no-code">No code detected</p>
        )}
      </div>
    </div>
  )
}

export default App
