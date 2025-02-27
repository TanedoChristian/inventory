import createProduct from "@/services/productService";

export async function POST(req: Request) {
  const { name, price, description, image, category, code } = await req.json();

  try {
    const product = await createProduct({
      name,
      price,
      description,
      image,
      category,
      code,
    });
    return Response.json(product, { status: 201 });
  } catch (error: unknown) {
    return Response.json(
      { message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
