"use client";

import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga';

const BarcodeReader = () => {
  const [barcode, setBarcode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const configureQuagga = () => {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: webcamRef.current.video,
          constraints: {
            width: 640,
            height: 480,
            facingMode: 'environment',
          },
        },
        decoder: {
          readers: [
            'code_128_reader',
            'ean_reader',
            'ean_8_reader',
            'code_39_reader',
            'code_39_vin_reader',
            'codabar_reader',
            'upc_reader',
            'upc_e_reader',
            'i2of5_reader',
          ],
        },
      },
      (err) => {
        if (err) {
          setErrorMsg(`Camera initialization error: ${err}`);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onProcessed((result) => {
      const ctx = canvasRef.current.getContext('2d');
      if (result) {
        if (result.boxes) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          const hasNotRead = !result.codeResult;

          if (hasNotRead) {
            result.boxes.filter((box) => box !== result.box).forEach((box) => {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, ctx, { color: 'red', lineWidth: 2 });
            });
          }
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, ctx, { color: 'blue', lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, ctx, { color: 'green', lineWidth: 3 });
        }
      }
    });

    Quagga.onDetected((result) => {
      if (result.codeResult.code) {
        setBarcode(result.codeResult.code);
        stopScanner();
      }
    });
  };

  const startScanner = () => {
    setScanning(true);
    setBarcode('');
    setErrorMsg('');
    setTimeout(() => {
      if (webcamRef.current && webcamRef.current.video) {
        configureQuagga();
      }
    }, 1000);
  };

  const stopScanner = () => {
    setScanning(false);
    Quagga.stop();
  };

  useEffect(() => {
    return () => {
      if (scanning) {
        Quagga.stop();
      }
    };
  }, [scanning]);

  return (
    <div className="flex flex-col items-center p-4 max-w-lg mx-auto">
      
      <div className="relative w-full mb-4">
        {scanning ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: 'environment',
              }}
              className="w-full rounded border"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
              width={640}
              height={480}
            />
          </>
        ) : (
          <div className="border-2 border-dashed border-gray-300 bg-gray-100 h-64 flex items-center justify-center rounded">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Camera will appear here</p>
              {barcode && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  <p className="font-bold">Barcode Detected:</p>
                  <p className="text-lg">{barcode}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded w-full">
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="flex space-x-4">
        {!scanning ? (
          <button
            onClick={startScanner}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Stop Scanning
          </button>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-500 w-full">
        <h3 className="font-bold mb-2">Instructions:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Click "Start Scanning" to activate your camera</li>
          <li>Point your camera at a barcode</li>
          <li>Hold steady until the barcode is detected</li>
          <li>The scanner will automatically stop when a barcode is found</li>
        </ol>
      </div>
    </div>
  );
};

export default BarcodeReader;