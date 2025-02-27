/* eslint-disable */

"use client";

import ProductForm from "@/app/components/Products/ProductForm";
import axios from "axios";
import { toast } from "sonner";

export default function Page() {
  const onSubmit = async (values: any) => {
    await axios.post("/api/products", values).then(() => {
      toast("Product saved successfully!");
    });
  };

  return <ProductForm onSubmit={onSubmit} />;
}
