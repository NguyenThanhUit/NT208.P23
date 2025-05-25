import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]";

export async function GET() {
    const session = await getServerSession(authOptions);
    return Response.json({ user: session?.user || null });
}
