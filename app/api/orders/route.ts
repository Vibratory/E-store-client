import { auth } from "@clerk/nextjs";
import { getOrders } from "@/lib/actions/actions";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json([], { status: 401 });

  const orders = await getOrders(userId);
  return NextResponse.json(orders);
}
