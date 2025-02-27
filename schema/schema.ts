import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  price: z.number().positive({ message: "Price must be greater than 0" }),
  description: z.string().nonempty({ message: "Description is required" }),
  image: z.string().optional(),
  category: z.string().nonempty({ message: "Category is required" }),
  code: z.string().optional(),
});
