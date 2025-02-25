"use client";

import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga';

const BarcodeReader = () => {
  const [barcode, setBarcode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [retryCount, setRetryCount] = useState(0);
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
            width: 1280,
            height: 720,
            facingMode: 'environment',
          },
        },
        decoder: {
          readers: [
            'ean_reader',
            'ean_8_reader',
            'ean_13_reader',
            'code_128_reader',
            'upc_reader',
            'upc_e_reader',
          ],
        },
        locator: {
          halfSample: true,
          patchSize: 'medium',
        },
        locate: true,
        numOfWorkers: navigator.hardwareConcurrency || 4,
        frequency: 10,
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
      } else if (retryCount < 3) {
        setRetryCount(retryCount + 1);
        setTimeout(() => {
          Quagga.start();
        }, 500);
      } else {
        setErrorMsg('Failed to detect barcode. Please try again.');
        stopScanner();
      }
    });
  };

  const startScanner = () => {
    setScanning(true);
    setBarcode('');
    setErrorMsg('');
    setRetryCount(0);
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
              width={1280}
              height={720}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-64 h-32 border-4 border-green-500 rounded-lg"></div>
              <p className="text-white text-center mt-2">Align barcode here</p>
            </div>
          </>
        ) : (
          <div className="border-2 bg-gray-100 h-64 flex items-center justify-center rounded">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Scan here</p>
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

      {barcode && (
        <div className="mb-4 p-3 bg-blue-100 border rounded mt-10">
          <p className="font-bold">Barcode: {barcode}</p>
        </div>
      )}
    </div>
  );
};

export default BarcodeReader;