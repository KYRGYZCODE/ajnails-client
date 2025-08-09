export async function getServices() {
  const response = await fetch("/api/services", {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // опционально — можно оставить, если хочешь отключить кэш
  });

  if (!response.ok) {
    throw new Error("Ошибка при загрузке услуг");
  }

  const data = await response.json();
  return data.results || data; // зависит от структуры ответа
}
