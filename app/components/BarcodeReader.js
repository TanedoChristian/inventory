import React, { useState } from "react";
import { useZxing } from "react-zxing";

export default function BarcodeReader() {
  const [scannedResult, setScannedResult] = useState("");
  const { ref } = useZxing({
    constraints: {
      video: {
        facingMode: "environment"
      }
    },
    onDecodeResult: (result) => setScannedResult(result.getText()),
    onError: (error) => {
      console.error(error);
    },
    formats: [
      "EAN_13",
      "EAN_8",
      "CODE_128",
      "CODE_39",
      "UPC_A",
      "UPC_E",
      "CODABAR"
    ],
    timeBetweenDecodingAttempts: 300,
    onDecodeAttempt: (result) => {
      // Optional: Handle decode attempts
      console.log("Attempting to decode:", result);
    }
  });

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="relative w-full max-w-md">
        <video 
          ref={ref} 
          className="w-full border rounded"
          style={{ maxHeight: '70vh' }}
        />
        <div className="absolute inset-0 border-2 border-red-500 border-dashed pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2/3 h-1/3 border-2 border-green-500 border-dashed"></div>
          </div>
        </div>
      </div>
      {scannedResult && (
        <div className="bg-green-100 p-4 rounded-lg w-full max-w-md">
          <p className="text-lg font-bold">Scanned: {scannedResult}</p>
        </div>
      )}
      <button 
        onClick={() => setScannedResult("")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Reset
      </button>
    </div>
  );
}