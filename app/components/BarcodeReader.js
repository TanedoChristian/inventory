import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga';

const BarcodeReader = () => {
  const [barcode, setBarcode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [productInfo, setProductInfo] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Configure Quagga settings
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
            'ean_reader',
            'ean_8_reader',
            'upc_reader',
            'upc_e_reader',
            'code_128_reader',
          ],
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true
          }
        },
        locator: {
          patchSize: 'medium',
          halfSample: true
        },
        numOfWorkers: 4,
        frequency: 10,
        locate: true,
      },
      (err) => {
        if (err) {
          setErrorMsg(`Camera initialization error: ${err}`);
          return;
        }
        Quagga.start();
      }
    );

    // Draw detection results
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

    // Handle barcode detection
    Quagga.onDetected((result) => {
      if (result.codeResult.code) {
        const detectedCode = result.codeResult.code;
        setBarcode(detectedCode);
        decodeBarcode(detectedCode, result.codeResult.format);
        stopScanner();
      }
    });
  };

  const decodeBarcode = (code, format) => {
    let productData = {
      barcode: code,
      format: format,
      type: 'Unknown',
      details: {}
    };

    // Identify barcode type and extract information
    if (/^(\d{12}|\d{13})$/.test(code)) {
      // EAN-13 or UPC-A
      if (code.length === 13) {
        productData.type = 'EAN-13';
        // First 2-3 digits for country code
        const countryCode = code.substring(0, 3);
        let country = 'Unknown';
        
        if (countryCode >= '000' && countryCode <= '019') country = 'USA & Canada';
        else if (countryCode >= '020' && countryCode <= '029') country = 'Restricted distribution';
        else if (countryCode >= '030' && countryCode <= '039') country = 'USA drugs';
        else if (countryCode >= '040' && countryCode <= '049') country = 'Restricted distribution';
        else if (countryCode >= '050' && countryCode <= '059') country = 'Coupons';
        else if (countryCode >= '060' && countryCode <= '139') country = 'USA & Canada';
        else if (countryCode >= '200' && countryCode <= '299') country = 'Restricted distribution';
        else if (countryCode >= '300' && countryCode <= '379') country = 'France';
        else if (countryCode >= '380' && countryCode <= '399') country = 'Bulgaria';
        else if (countryCode >= '400' && countryCode <= '440') country = 'Germany';
        else if (countryCode >= '450' && countryCode <= '459') country = 'Japan';
        else if (countryCode >= '460' && countryCode <= '469') country = 'Russia';
        else if (countryCode >= '470' && countryCode <= '479') country = 'Kyrgyzstan';
        else if (countryCode >= '480' && countryCode <= '489') country = 'Philippines';
        else if (countryCode >= '500' && countryCode <= '509') country = 'United Kingdom';
        else if (countryCode >= '520' && countryCode <= '521') country = 'Greece';
        else if (countryCode >= '540' && countryCode <= '549') country = 'Belgium & Luxembourg';
        else if (countryCode >= '560' && countryCode <= '569') country = 'Portugal';
        else if (countryCode >= '570' && countryCode <= '579') country = 'Denmark';
        else if (countryCode >= '590' && countryCode <= '599') country = 'Poland';
        else if (countryCode >= '600' && countryCode <= '601') country = 'South Africa';
        else if (countryCode >= '608' && countryCode <= '617') country = 'Bahrain';
        else if (countryCode >= '619' && countryCode <= '619') country = 'Tunisia';
        else if (countryCode >= '620' && countryCode <= '621') country = 'Tanzania';
        else if (countryCode >= '622' && countryCode <= '622') country = 'UAE';
        else if (countryCode >= '624' && countryCode <= '625') country = 'UAE';
        else if (countryCode >= '626' && countryCode <= '626') country = 'Iran';
        else if (countryCode >= '627' && countryCode <= '627') country = 'Kuwait';
        else if (countryCode >= '628' && countryCode <= '628') country = 'Saudi Arabia';
        else if (countryCode >= '629' && countryCode <= '629') country = 'UAE';
        else if (countryCode >= '640' && countryCode <= '649') country = 'Finland';
        else if (countryCode >= '690' && countryCode <= '699') country = 'China';
        else if (countryCode >= '700' && countryCode <= '709') country = 'Norway';
        else if (countryCode >= '730' && countryCode <= '739') country = 'Sweden';
        else if (countryCode >= '740' && countryCode <= '749') country = 'Guatemala';
        else if (countryCode >= '750' && countryCode <= '759') country = 'Mexico';
        else if (countryCode >= '760' && countryCode <= '769') country = 'Switzerland';
        else if (countryCode >= '770' && countryCode <= '771') country = 'Colombia';
        else if (countryCode >= '778' && countryCode <= '779') country = 'Argentina';
        else if (countryCode >= '780' && countryCode <= '780') country = 'Chile';
        else if (countryCode >= '784' && countryCode <= '784') country = 'Paraguay';
        else if (countryCode >= '786' && countryCode <= '786') country = 'Ecuador';
        else if (countryCode >= '789' && countryCode <= '790') country = 'Brazil';
        else if (countryCode >= '800' && countryCode <= '839') country = 'Italy';
        else if (countryCode >= '840' && countryCode <= '849') country = 'Spain';
        else if (countryCode >= '850' && countryCode <= '850') country = 'Cuba';
        else if (countryCode >= '858' && countryCode <= '858') country = 'Slovakia';
        else if (countryCode >= '859' && countryCode <= '859') country = 'Czech Republic';
        else if (countryCode >= '860' && countryCode <= '869') country = 'Serbia';
        else if (countryCode >= '870' && countryCode <= '879') country = 'Netherlands';
        else if (countryCode >= '880' && countryCode <= '889') country = 'South Korea';
        else if (countryCode >= '890' && countryCode <= '899') country = 'India';
        else if (countryCode >= '900' && countryCode <= '919') country = 'Austria';
        else if (countryCode >= '930' && countryCode <= '939') country = 'Australia';
        else if (countryCode >= '940' && countryCode <= '949') country = 'New Zealand';
        else if (countryCode >= '950' && countryCode <= '950') country = 'GS1 Global Office';
        else if (countryCode >= '955' && countryCode <= '955') country = 'Malaysia';
        else if (countryCode >= '958' && countryCode <= '958') country = 'Macau';
        
        productData.details = {
          countryCode: countryCode,
          countryOfOrigin: country,
          manufacturerCode: code.substring(3, 7),
          productCode: code.substring(7, 12),
          checkDigit: code.substring(12, 13)
        };
      } else if (code.length === 12) {
        productData.type = 'UPC-A';
        productData.details = {
          systemDigit: code.substring(0, 1),
          manufacturerCode: code.substring(1, 6),
          productCode: code.substring(6, 11),
          checkDigit: code.substring(11, 12)
        };
        
        // System digit meaning
        const systemDigit = code.substring(0, 1);
        let systemMeaning = '';
        switch(systemDigit) {
          case '0': 
            systemMeaning = 'Regular UPC code';
            break;
          case '1': 
            systemMeaning = 'Reserved';
            break;
          case '2': 
            systemMeaning = 'Random weight items (meat, produce)';
            break;
          case '3': 
            systemMeaning = 'Pharmaceuticals';
            break;
          case '4': 
            systemMeaning = 'In-store marking for retailers';
            break;
          case '5': 
            systemMeaning = 'Coupons';
            break;
          case '6': 
            systemMeaning = 'Regular UPC code';
            break;
          case '7': 
            systemMeaning = 'Regular UPC code';
            break;
          case '8': 
            systemMeaning = 'Reserved';
            break;
          case '9': 
            systemMeaning = 'Reserved';
            break;
          default:
            systemMeaning = 'Unknown';
        }
        
        productData.details.systemMeaning = systemMeaning;
      }
    } else if (/^\d{8}$/.test(code)) {
      // EAN-8
      productData.type = 'EAN-8';
      productData.details = {
        countryCode: code.substring(0, 2),
        productCode: code.substring(2, 7),
        checkDigit: code.substring(7, 8)
      };
    } else if (/^\d{14}$/.test(code)) {
      // GTIN-14 / ITF-14
      productData.type = 'GTIN-14';
      productData.details = {
        indicator: code.substring(0, 1),
        companyPrefix: code.substring(1, 7),
        itemReference: code.substring(7, 13),
        checkDigit: code.substring(13, 14)
      };
      
      // Indicator meaning
      const indicator = code.substring(0, 1);
      let packagingLevel = '';
      switch(indicator) {
        case '0': 
          packagingLevel = 'Standard trade item';
          break;
        case '1': 
          packagingLevel = 'Packaging level 1';
          break;
        case '2': 
          packagingLevel = 'Packaging level 2';
          break;
        case '3': 
          packagingLevel = 'Packaging level 3';
          break;
        case '4': 
          packagingLevel = 'Packaging level 4';
          break;
        case '5': 
          packagingLevel = 'Packaging level 5';
          break;
        case '6': 
          packagingLevel = 'Packaging level 6';
          break;
        case '7': 
          packagingLevel = 'Packaging level 7';
          break;
        case '8': 
          packagingLevel = 'Packaging level 8';
          break;
        case '9': 
          packagingLevel = 'Packaging level 9';
          break;
        default:
          packagingLevel = 'Unknown';
      }
      
      productData.details.packagingLevel = packagingLevel;
    }
    
    // Validate check digit
    const isValid = validateCheckDigit(code);
    productData.isValid = isValid;
    
    setProductInfo(productData);
  };
  
  const validateCheckDigit = (code) => {
    // Implementing check digit validation for common retail barcodes
    if (code.length === 8 || code.length === 13) {
      // EAN-8 and EAN-13 validation
      let sum = 0;
      const digits = code.split('').map(Number);
      const checkDigit = digits.pop();
      
      digits.reverse().forEach((digit, i) => {
        sum += digit * (i % 2 === 0 ? 3 : 1);
      });
      
      const calculatedCheckDigit = (10 - (sum % 10)) % 10;
      return calculatedCheckDigit === checkDigit;
    } else if (code.length === 12) {
      // UPC-A validation
      let sum = 0;
      const digits = code.split('').map(Number);
      const checkDigit = digits.pop();
      
      digits.forEach((digit, i) => {
        sum += digit * (i % 2 === 0 ? 1 : 3);
      });
      
      const calculatedCheckDigit = (10 - (sum % 10)) % 10;
      return calculatedCheckDigit === checkDigit;
    }
    
    return true; // Skip validation for unknown formats
  };

  const startScanner = () => {
    setScanning(true);
    setBarcode('');
    setProductInfo(null);
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

  const manualDecode = () => {
    if (barcode) {
      decodeBarcode(barcode, 'manual');
    } else {
      setErrorMsg('Please enter a barcode to decode');
    }
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
      <h2 className="text-2xl font-bold mb-4">Retail Barcode Decoder</h2>
      
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
          <div className="border-2 border-dashed border-gray-300 bg-gray-100 p-4 rounded">
            <div className="mb-4">
              <label htmlFor="manual-barcode" className="block text-gray-700 mb-2">
                Enter Barcode Manually:
              </label>
              <div className="flex">
                <input 
                  id="manual-barcode"
                  type="text" 
                  value={barcode} 
                  onChange={(e) => setBarcode(e.target.value)} 
                  className="flex-1 p-2 border rounded-l"
                  placeholder="e.g. 5901234123457"
                />
                <button 
                  onClick={manualDecode} 
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-r"
                >
                  Decode
                </button>
              </div>
            </div>
            
            {productInfo && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-bold text-lg mb-2">Product Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-semibold">Barcode:</div>
                  <div>{productInfo.barcode}</div>
                  
                  <div className="font-semibold">Format:</div>
                  <div>{productInfo.format || 'N/A'}</div>
                  
                  <div className="font-semibold">Type:</div>
                  <div>{productInfo.type}</div>
                  
                  <div className="font-semibold">Valid:</div>
                  <div>{productInfo.isValid ? 'Yes' : 'No'}</div>
                  
                  {productInfo.type === 'EAN-13' && (
                    <>
                      <div className="font-semibold">Country Code:</div>
                      <div>{productInfo.details.countryCode}</div>
                      
                      <div className="font-semibold">Country:</div>
                      <div>{productInfo.details.countryOfOrigin}</div>
                      
                      <div className="font-semibold">Manufacturer Code:</div>
                      <div>{productInfo.details.manufacturerCode}</div>
                      
                      <div className="font-semibold">Product Code:</div>
                      <div>{productInfo.details.productCode}</div>
                      
                      <div className="font-semibold">Check Digit:</div>
                      <div>{productInfo.details.checkDigit}</div>
                    </>
                  )}
                  
                  {productInfo.type === 'UPC-A' && (
                    <>
                      <div className="font-semibold">System Digit:</div>
                      <div>{productInfo.details.systemDigit}</div>
                      
                      <div className="font-semibold">System Meaning:</div>
                      <div>{productInfo.details.systemMeaning}</div>
                      
                      <div className="font-semibold">Manufacturer Code:</div>
                      <div>{productInfo.details.manufacturerCode}</div>
                      
                      <div className="font-semibold">Product Code:</div>
                      <div>{productInfo.details.productCode}</div>
                      
                      <div className="font-semibold">Check Digit:</div>
                      <div>{productInfo.details.checkDigit}</div>
                    </>
                  )}
                  
                  {productInfo.type === 'EAN-8' && (
                    <>
                      <div className="font-semibold">Country Code:</div>
                      <div>{productInfo.details.countryCode}</div>
                      
                      <div className="font-semibold">Product Code:</div>
                      <div>{productInfo.details.productCode}</div>
                      
                      <div className="font-semibold">Check Digit:</div>
                      <div>{productInfo.details.checkDigit}</div>
                    </>
                  )}
                  
                  {productInfo.type === 'GTIN-14' && (
                    <>
                      <div className="font-semibold">Indicator:</div>
                      <div>{productInfo.details.indicator}</div>
                      
                      <div className="font-semibold">Packaging Level:</div>
                      <div>{productInfo.details.packagingLevel}</div>
                      
                      <div className="font-semibold">Company Prefix:</div>
                      <div>{productInfo.details.companyPrefix}</div>
                      
                      <div className="font-semibold">Item Reference:</div>
                      <div>{productInfo.details.itemReference}</div>
                      
                      <div className="font-semibold">Check Digit:</div>
                      <div>{productInfo.details.checkDigit}</div>
                    </>
                  )}
                </div>
              </div>
            )}
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
            Scan Barcode
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
        <h3 className="font-bold mb-2">Supported Retail Barcode Formats:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>EAN-13: International 13-digit retail product code</li>
          <li>UPC-A: 12-digit standard retail product code (US)</li>
          <li>EAN-8: Shortened 8-digit code for small packages</li>
          <li>GTIN-14: 14-digit code for shipping containers</li>
        </ul>
      </div>
    </div>
  );
};

export default BarcodeReader;