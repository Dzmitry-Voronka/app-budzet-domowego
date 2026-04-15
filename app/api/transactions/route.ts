import { NextResponse } from "next/server";

export const dynamic = "force-static";

// Static stub — real data fetching happens client-side
export async function GET() {
  return NextResponse.json({
    success: true,
    data: [],
    meta: { total: 0, page: 1, lastPage: 1, limit: 20 },
  });
}
