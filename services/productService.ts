import { prisma } from "@/prisma/prisma";
import { productFormSchema } from "@/schema/schema";
import { ProductForm } from "@/types/types";

export default async function createProduct(data: ProductForm) {
  productFormSchema.parse(data);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
      image: data.image,
      categoryId: "fb3c913f-bd62-47db-bc7e-511acb892c3a",
      code: data.code,
      tenantId: process.env.TENANT_ID || "",
    },
  });

  return product;
}
