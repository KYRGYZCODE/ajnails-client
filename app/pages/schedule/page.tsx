// app/schedule/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { Crown } from "lucide-react"; // добавили иконку короны

interface Employee {
  uuid: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  schedule_start: string; // "HH:mm:ss"
  schedule_end: string;   // "HH:mm:ss"
  schedule?: {
    weekday_name: string;
    start_time: string;
    end_time: string;
  }[];
}

export default function SchedulePage() {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        return res.json();
      })
      .then((data) => setEmployees(data.results))
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Ошибка при загрузке: {error}
      </div>
    );
  }
  if (employees === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-rose-600 border-gray-200"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-semibold text-center text-rose-600 mb-8">
        Расписание мастеров VIP
      </h1>

      {/* Десктопная таблица */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-rose-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">Мастер</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">Телефон</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">Часы работы</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">Дни недели</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((emp, idx) => (
              <tr key={emp.uuid} className={idx % 2 === 0 ? "bg-white" : "bg-neutral-100"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {emp.first_name} {emp.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <a href={`tel:${emp.phone_number}`} className="inline-flex items-center text-rose-600 hover:underline">
                    <Phone className="w-4 h-4 mr-1" />
                    {emp.phone_number}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {emp.schedule_start.slice(0, 5)}–{emp.schedule_end.slice(0, 5)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  {emp.schedule?.length
                    ? emp.schedule.map(d => (
                        <span key={d.weekday_name} className="inline-block mr-2">
                          <span className="capitalize font-medium">{d.weekday_name}</span> ({d.start_time.slice(0,5)}–{d.end_time.slice(0,5)})
                        </span>
                      ))
                    : "Ежедневно"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Мобильные VIP‑карточки */}
      <div className="md:hidden space-y-6">
        {employees.map(emp => (
          <div
            key={emp.uuid}
            className="relative bg-gradient-to-br from-purple-50 to-rose-50 p-5 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Золотая кайма */}
            <span className="absolute inset-0 border-2 border-yellow-400 rounded-2xl pointer-events-none"></span>
            {/* VIP‑иконка */}
            <div className="absolute top-3 right-3 text-yellow-500">
              <Crown className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center">
              {emp.first_name} {emp.last_name}
            </h2>
            <a
              href={`tel:${emp.phone_number}`}
              className="flex items-center text-rose-600 hover:underline mb-3"
            >
              <Phone className="w-5 h-5 mr-2" />
              <span className="font-medium">{emp.phone_number}</span>
            </a>

            <div className="space-y-1 text-sm text-slate-800">
              <p>
                <span className="font-semibold">Часы работы:</span>{" "}
                {emp.schedule_start.slice(0,5)}–{emp.schedule_end.slice(0,5)}
              </p>
              <p>
                <span className="font-semibold">Дни недели:</span>{" "}
                {emp.schedule?.length
                  ? emp.schedule.map(d => (
                      <span key={d.weekday_name} className="inline-block mr-1">
                        <span className="capitalize">{d.weekday_name}</span>
                      </span>
                    ))
                  : "Ежедневно"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
