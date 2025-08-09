import { Slots } from "../hooks/useBooking";

/* Тип услуги.  Если у вас уже есть свой интерфейс – используйте его */
export interface Service {
  id: number;
  name: string;
  duration: number;
  price: string | number;   // было: number
  is_long: boolean;
  additional_services?: {
    id: number
    name: string
    duration: number
    price: string
    image: string | null
    is_long: boolean
    is_additional: boolean
    parent_service: number
  }
  is_additional: boolean
  parent_service: number | null
}

/* ---------------------- ПАГИНАЦИЯ ДЛЯ УСЛУГ ---------------------- */
export async function fetchServices(page = 1, limit = 8, search: string = "") {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String((page - 1) * limit),
  });

  if (search) params.set("search", search);

  const response = await fetch(`/api/services/?${params.toString()}`);
  if (!response.ok) throw new Error("Ошибка при загрузке услуг");

  /* DRF-подобный ответ { count, next, previous, results } */
  return (await response.json()) as {
    count: number;
    next: string | null;
    previous: string | null;
    results: Service[];
  };
}

/* ---------------------------------------------------------------- */

export async function fetchAvailableMasters(
  serviceIds: number[],
  date?: string,
  time?: string,
) {
  const url = `/api/available-slots/?service_ids=${serviceIds.join(",")}&date=${date}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Ошибка при загрузке мастеров");
  const { results } = await response.json();
  return results;
}

export async function fetchAvailableSlots(
  serviceIds: number[],
  date: string,
): Promise<Slots> {
  const url = `/api/available-slots/?service_ids=${serviceIds.join(",")}&date=${date}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return (await response.json()) as Slots;
}

export async function createAppointment(form: {
  clientName: string;
  clientPhone: string;
  date: string;
  masterUuid: string;
  serviceIds: number[];
}) {
  const response = await fetch("/api/create-appointment/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientName: form.clientName,
      clientPhone: form.clientPhone,
      date: form.date,
      masterId: form.masterUuid,
      serviceId: form.serviceIds,
    }),   
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    let message =
      typeof payload === "object"
        ? Object.entries(payload)
            .map(([k, v]) =>
              Array.isArray(v) ? `${k}: ${v.join(", ")}` : `${k}: ${v}`,
            )
            .join("; ")
        : `Ошибка ${response.status}: ${payload}`;
    throw new Error(message);
  }

  if (typeof payload === "object" && payload?.data?.payment_url) {
    window.location.href = payload.data.payment_url;
    return;
  }

  return payload;
}
