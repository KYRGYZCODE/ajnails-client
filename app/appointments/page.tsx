// app/appointments/page.tsx
"use client";

import { Briefcase, CalendarDays, Phone, User } from "lucide-react";

import { useLeads } from "@/app/appointments/hooks/useLeads";
import { useServiceAndMasters } from "@/app/appointments/hooks/useServiceAndMasters";

export default function AppointmentsPage() {
  const appointments = useLeads();
  const { services } = useServiceAndMasters();

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 py-16 px-6 font-inter">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-amber-600 mb-12 tracking-tight">
          Ваши записи в Ajnails
        </h1>
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center text-pink-600 hover:text-pink-800 font-semibold transition"
          >
            ← На главную
          </a>
        </div>

        {appointments.length === 0 && (
          <p className="text-center text-gray-500 text-xl italic mb-12">
            У вас пока нет записей. Сделайте первый шаг к преображению ✨
          </p>
        )}

        <div className="space-y-10">
          {appointments.map((appt) => {
            const serviceNames = Array.isArray(appt.services)
              ? appt.services.map((id) => services[id] || `Услуга #${id}`)
              : [];

            return (
              <div
                key={appt.id}
                className="relative bg-white bg-opacity-70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-shadow duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 rounded-t-3xl" />

                <h2 className="mt-4 text-2xl font-bold text-gray-800 mb-4">
                  <Briefcase className="inline-block w-6 h-6 text-rose-500 mr-2" />
                  Услуги
                </h2>
                <ul className="list-disc list-inside space-y-1 mb-6 text-gray-700">
                  {serviceNames.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-600">
                  <div className="flex items-center space-x-3">
                    <CalendarDays className="w-5 h-5 text-rose-400" />
                    <span className="text-lg">{formatDate(appt.dateTime)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-rose-400" />
                    <span className="text-lg">{appt.clientName}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-rose-400" />
                    <span className="text-lg">{appt.clientPhone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-400">Мастер:</span>
                    <span className="text-base font-medium text-gray-700">
                      {appt.masterName}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
