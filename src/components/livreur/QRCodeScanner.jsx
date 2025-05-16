import { useState, useEffect, useRef } from 'react';
import { Camera, X, Scan, RefreshCw, Check } from 'lucide-react';

export default function QRCodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const [error, setError] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanAnimation, setScanAnimation] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  // Fonction pour démarrer la caméra
  const startScanning = async () => {
    setError(null);
    setScanning(true);
    setScanProgress(0);
    setScanAnimation(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        scanQRCode();
        startProgressAnimation();
      }
    } catch (err) {
      setError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.");
      setScanning(false);
      setScanAnimation(false);
    }
  };

  // Fonction pour l'animation de progression
  const startProgressAnimation = () => {
    let progress = 0;
    const duration = 3000; // 3 secondes pour la simulation
    const interval = 30; // Mise à jour toutes les 30ms
    const step = 100 / (duration / interval);
    
    animationRef.current = setInterval(() => {
      progress += step;
      if (progress >= 100) {
        progress = 100;
        clearInterval(animationRef.current);
      }
      setScanProgress(progress);
    }, interval);
  };

  // Fonction pour arrêter la caméra
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    setScanning(false);
    setScanAnimation(false);
  };

  // Fonction pour scanner le QR code
  const scanQRCode = () => {
    if (!scanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Simuler une détection de QR code
      const simulateQRCodeDetection = () => {
        setTimeout(() => {
          if (scanning) {
            setScannedCode('https://example.com/qrcode-123456');
            stopScanning();
          }
        }, 3000);
      };
      
      simulateQRCodeDetection();
    }
    
    if (scanning) {
      requestAnimationFrame(scanQRCode);
    }
  };

  // Nettoyer lors du démontage du composant
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto bg-gradient-to-b from-indigo-50 to-blue-100 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-indigo-900 flex items-center">
        <Scan className="mr-2 text-indigo-600" size={32} />
        <span>QR Scanner</span>
      </h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-md mb-6 w-full shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {scannedCode ? (
        <div className="w-full transition-all duration-300 ease-in-out">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl mb-6 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="text-green-600" size={24} />
              </div>
              <h3 className="font-bold text-xl ml-3 text-green-800">QR Code détecté!</h3>
            </div>
            <div className="bg-white bg-opacity-70 p-4 rounded-lg break-all border border-green-100">
              <p className="text-gray-700">{scannedCode}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setScannedCode(null);
              setScanning(false);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 text-white font-bold py-3 px-6 rounded-xl w-full flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="mr-2" size={20} />
            Scanner un autre code
          </button>
        </div>
      ) : (
        <div className="w-full">
          {scanning ? (
            <div className="relative w-full overflow-hidden rounded-2xl shadow-xl">
              <video 
                ref={videoRef} 
                className="w-full h-80 bg-black rounded-2xl object-cover"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Overlay de scan avec animation */}
              <div className="absolute inset-0 border-4 border-indigo-400 rounded-2xl pointer-events-none overflow-hidden">
                {scanAnimation && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-400 opacity-80 animate-pulse" 
                       style={{ 
                         top: `${Math.min(scanProgress, 100)}%`,
                         boxShadow: '0 0 15px rgba(129, 140, 248, 0.8)'
                       }}
                  ></div>
                )}
                <div className="absolute inset-0 border-[20px] border-indigo-500 border-opacity-10 rounded-xl"></div>
                
                {/* Coins de guidage animés */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg animate-pulse"></div>
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-indigo-500 rounded-br-lg animate-pulse"></div>
              </div>
              
              <button 
                onClick={stopScanning}
                className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 hover:bg-red-50 text-red-600 p-2 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
              >
                <X size={24} />
              </button>
              
              {/* Barre de progression en bas */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <div className="bg-black bg-opacity-50 text-white py-2 px-4 rounded-full inline-flex items-center mx-auto">
                  <Camera className="mr-2" size={18} />
                  <span>Centrez le QR code dans le cadre</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-6">
              <div className="bg-white bg-opacity-60 p-6 rounded-xl shadow-sm text-center">
                <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center bg-indigo-100 rounded-full">
                  <Camera className="text-indigo-600" size={36} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Prêt à scanner</h3>
                <p className="text-gray-600 text-sm">Appuyez sur le bouton ci-dessous pour activer la caméra et scanner un QR code.</p>
              </div>
              
              <button 
                onClick={startScanning}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center w-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Scan className="mr-2" size={24} />
                Activer le scanner
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}