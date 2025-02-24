import {NextApiResponse} from 'next';
import Tenant from "@/schema/tenantSchema";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
    await dbConnect();

    
    const { name, code } = await req.json();
    if (!name || !code) {
        return Response.json({ message: 'Name and code are required' }, { status: 400 });
    }
    try {
        const tenant = await Tenant.create({ name, code });
        return Response.json(tenant, { status: 201 });
    } catch (error: unknown) {
        return Response.json({ message: error instanceof Error ? error.message : 'An error occurred'}, { status: 500 });
    }
}

