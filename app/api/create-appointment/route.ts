import { NextResponse } from 'next/server';
import { NEXT_PUBLIC_API_URL } from '@/app/lib/consts';


export async function POST(request: Request) {
  try {
    const data = await request.json();

    const requestBody = {
      client_name: data.clientName,
      phone: data.clientPhone,
      date_time: data.date,
      master: data.masterId, 
      services: data.serviceId, 
    };

    const apiResponse = await fetch(`${NEXT_PUBLIC_API_URL}/leads/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const contentType = apiResponse.headers.get("content-type") || "";

    let result: any;
    if (contentType.includes("application/json")) {
      result = await apiResponse.json();
      console.log('result', result)
    } else {
      const text = await apiResponse.text();
      console.warn("Non-JSON response from API:", text);
      return NextResponse.json(
        { success: false, message: "Ошибка сервера: невалидный ответ от API" },
        { status: 500 }
      );
    }

    if (apiResponse.status !== 201) {
      return NextResponse.json(
        {
          
          message:result?.non_field_errors || "Ошибка при создании записи",
        },
        { status: apiResponse.status }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Запись успешно создана",
      data: result,
    });
  } catch (error) {
    console.error("Create appointment error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Произошла неизвестная ошибка при создании записи",
      },
      { status: 500 }
    );
  }
}
