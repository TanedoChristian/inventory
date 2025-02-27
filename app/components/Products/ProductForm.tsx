/* eslint-disable */

"use client";

import { z } from "zod";
import BaseForm from "../BaseForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  ImageIcon,
  LayoutGrid,
  Barcode,
  Camera,
} from "lucide-react";
import BaseInput from "../BaseInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from "html5-qrcode";

const productFormSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  price: z.number().positive({ message: "Price must be greater than 0" }),
  description: z.string().nonempty({ message: "Description is required" }),
  image: z.string().optional(),
  category: z.string().nonempty({ message: "Category is required" }),
  code: z.string().optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSubmit: (values: ProductFormData) => void;
  product?: Partial<ProductFormData>;
}

export default function ProductForm({ onSubmit, product }: ProductFormProps) {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const form = useForm<ProductFormData>({
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price ?? 0,
      description: product?.description ?? "",
      image: product?.image ?? "",
      category: product?.category ?? "",
      code: product?.code ?? "",
    },
    resolver: zodResolver(productFormSchema),
  });

  const handleSubmit = async (data: ProductFormData) => {
    await onSubmit(data);
    if (!product) {
      form.reset();
    }
  };

  const getQrBoxSize = () => {
    const screenWidth = window.innerWidth;
    return screenWidth < 640 ? screenWidth * 0.8 : 250;
  };

  const startScanning = async () => {
    setScanning(true);

    setTimeout(async () => {
      const scannerElement = document.getElementById("barcode-scanner");
      if (!scannerElement) {
        console.error("Scanner element not found!");
        setScanning(false);
        return;
      }

      const scanner = new Html5Qrcode("barcode-scanner");
      scannerRef.current = scanner;

      const config: Html5QrcodeCameraScanConfig = {
        fps: 30,
        qrbox: { width: getQrBoxSize(), height: getQrBoxSize() },
        aspectRatio: 1.0,
        disableFlip: false,
      };

      try {
        await scanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            console.log("✅ Scanned Code:", decodedText);
            form.setValue("code", decodedText);
            stopScanning();
          },
          (errorMessage) => {
            console.warn("Scanning error:", errorMessage);
          }
        );
      } catch (err) {
        console.error("Failed to start scanner:", err);
        setScanning(false);
      }
    }, 200); // Small delay to ensure element is mounted
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Failed to stop scanning:", err);
      }
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
          {product ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <BaseForm form={form} onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                control={form.control}
                label="Product Name"
                name="name"
                placeHolder="Enter product name"
                icon={
                  <ShoppingCart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                }
                className="bg-white dark:bg-gray-800 py-6 shadow-sm"
              />
              <BaseInput
                control={form.control}
                type="number"
                label="Price"
                name="price"
                placeHolder="0.00"
                icon={
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    $
                  </span>
                }
                className="pl-6 bg-white dark:bg-gray-800 py-6 shadow-sm"
              />
            </div>

            <div>
              <BaseInput
                control={form.control}
                label="Description"
                name="description"
                placeHolder="Enter product description"
                className="bg-white dark:bg-gray-800 py-6"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                control={form.control}
                label="Category"
                name="category"
                placeHolder="Select category"
                icon={
                  <LayoutGrid className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                }
                className="bg-white dark:bg-gray-800 py-6 shadow-sm"
              />
              <BaseInput
                control={form.control}
                label="Product Code"
                name="code"
                placeHolder="Enter SKU or product code"
                icon={
                  <Barcode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                }
                className="bg-white dark:bg-gray-800 py-6 shadow-sm"
              />
              <button
                type="button"
                onClick={startScanning}
                className="mt-2 flex items-center gap-2 text-blue-600 dark:text-blue-400"
              >
                <Camera className="w-4 h-4" /> Or Scan Barcode
              </button>

              {scanning && (
                <div className="relative w-full max-w-[500px] h-[300px] mx-auto overflow-hidden">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 z-10 animate-scan-line"></div>
                  <div id="barcode-scanner" className="w-full h-full"></div>
                  <button onClick={stopScanning} className="mt-2 text-red-500">
                    Stop Scanning
                  </button>
                </div>
              )}
            </div>

            <div className="col-span-full">
              <BaseInput
                control={form.control}
                label="Product Image"
                name="image"
                placeHolder="Upload or enter image URL"
                icon={
                  <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                }
                className="bg-white dark:bg-gray-800 py-6 shadow-sm outline-none"
              />
            </div>
          </div>
        </BaseForm>
      </CardContent>
    </Card>
  );
}
