import { useState, useRef, useEffect } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'
import './App.css'

function App() {
  console.log('App component rendering...');
  const [isScanning, setIsScanning] = useState(false)
  const [codeData, setCodeData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const videoRef = useRef(null)
  const codeReader = useRef(new BrowserMultiFormatReader())

  useEffect(() => {
    console.log('App component mounted');
    setIsLoading(false);
    return () => {
      console.log('App component unmounting');
      if (isScanning) {
        stopScanning()
      }
    }
  }, [])

  const startScanning = async () => {
    console.log('Starting scanning...');
    try {
      const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices()
      console.log('Available video devices:', videoInputDevices);
      const selectedDeviceId = videoInputDevices[0].deviceId
      
      setIsScanning(true)
      setCodeData(null)

      codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            console.log('Code detected:', result);
            setCodeData({
              text: result.getText(),
              format: result.getBarcodeFormat()
            })
          }
          if (err && !(err instanceof Error)) {
            console.error('Scanning error:', err)
          }
        }
      )
    } catch (err) {
      console.error('Error starting camera:', err)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    console.log('Stopping scanning...');
    codeReader.current.reset()
    setIsScanning(false)
  }

  if (isLoading) {
    return (
      <div className="app-container">
        <h1>Loading...</h1>
      </div>
    )
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
