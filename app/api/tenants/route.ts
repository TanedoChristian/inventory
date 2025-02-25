import { prisma } from "@/prisma/prisma";
import { createTenant } from "@/services/tenantService";



export async function POST(req: Request) {

    const { name, code } = await req.json();


    try {
        const tenant = await createTenant({ name, code });
        return Response.json(tenant, { status: 201 });

        
    } catch (error: unknown) {
        return Response.json({ message: error instanceof Error ? error.message : 'An error occurred'}, { status: 500 });
    }
}

