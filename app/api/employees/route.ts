import { NextRequest, NextResponse } from "next/server";
import { NEXT_PUBLIC_API_URL } from "@/app/lib/consts";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ordering = searchParams.get("ordering");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const service = searchParams.get("service");
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    let url = `${NEXT_PUBLIC_API_URL}/employees/?`;

    if (ordering) url += `ordering=${ordering}&`;
    if (limit)     url += `limit=${limit}&`;
    if (offset)    url += `offset=${offset}&`;
    if (service)   url += `service_id=${service}&`;
    if (date)      url += `date=${date}&`;
    if (time)      url += `time=${time}&`;

    url = url.replace(/&$/, ""); // убираем финальный "&"

    console.log("Employees API URL:", url);

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // безопасно логируем первый uuid, если он есть
    if (Array.isArray(data.results) && data.results.length > 0) {
      console.log("Employees API response, первый uuid:", data.results[0].uuid);
    } else {
      console.log("Employees API response: нет доступных мастеров", data.results);
    }

    // просто возвращаем то, что вернул бэкенд — пусть в клиенте обрабатывают пустой массив
    return NextResponse.json(data);
  } catch (error) {
    console.error("Employees API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch employees",
      },
      { status: 500 }
    );
  }
}
