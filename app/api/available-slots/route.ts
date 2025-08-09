import { NextRequest, NextResponse } from "next/server";
import { NEXT_PUBLIC_API_URL } from "@/app/lib/consts";

export async function GET(request: NextRequest) {
  /* ─────────────────────────────────────────────────────────
   *  1. Берём исходную часть URL после «?» (search)  
   *  2. Убираем сам «?»  →  slice(1)  
   *  3. Один раз декодируем, чтобы %2C → ,                 */
  const qs = decodeURIComponent(request.nextUrl.search.slice(1));
  // qs === "service_ids=13,26&date=2025-06-25"

  const upstream = `${NEXT_PUBLIC_API_URL}/employees/available-slots/?${qs}`;
  const res = await fetch(upstream);

  if (!res.ok) {
    if (res.status === 400) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData }, { status: 400 });
    }
    return NextResponse.json({ error: "Произошла ошибка" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
