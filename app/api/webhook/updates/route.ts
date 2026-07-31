import { NextResponse } from "next/server";
import { getOrders } from "@/actions/orderActions";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('query') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);

    try {
        const data = await getOrders({ query, sort, page });
        return NextResponse.json(data);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}