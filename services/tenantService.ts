import { prisma } from '@/prisma/prisma';
import {z} from 'zod'



const tenantSchema = z.object({
    name: z.string(),
    code: z.string().optional()
});


interface TenantSchema {
    name: string;
    code?: string;
}

export async function createTenant(data: TenantSchema){
    tenantSchema.parse(data);

    const tenant = await prisma.tenant.create({
        data: {
            name: data.name,
            domain: data.code
        }
    });
    return tenant;
}



export async function createPost(data: any){
    const post = await prisma.post.create({data: {...data}});
    return post;
}