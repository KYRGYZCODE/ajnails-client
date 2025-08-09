export async function getEmployees() {
    const response = await fetch("/api/employees", {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", 
    });
  
    if (!response.ok) {
      throw new Error("Ошибка при загрузке услуг");
    }
  
    const data = await response.json();

    return data.results || data;
  }
  