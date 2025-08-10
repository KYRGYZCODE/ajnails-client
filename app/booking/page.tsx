"use client";


import { AnimatePresence, motion } from "framer-motion";
import { Crown, Sparkles, Star, Award } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Footer from "@/components/footer";
import Head from "next/head";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/public/Freedom_Pay_.svg";
import MasterList from "@/components/sections/MasterList";
import { NEXT_PUBLIC_API_URL } from "../lib/consts";
import { useBooking } from "./hooks/useBooking";
import { ServiceItem } from "@/components/ui/ServiceItem";


export default function BookingPage() {
  const {
    /* пагинация */
    services,
    servicesPage,
    totalServicePages,
    setServicesPage,

    /* остальное */
    loading,
    submitting,
    error,
    form,
    setForm,
    slots,
    noSlots,
    setSlots,
    selectedMaster,
    setSelectedMaster,
    handleSubmit,
    setSearchTerm,
    searchTerm
  } = useBooking();

  /* ------------------------ локальное состояние ------------------------ */
  const [step, setStep] = useState<1 | 2 | 5>(1);
  const [dateError, setDateError] = useState<string | null>(null);

  // календарь
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1); // 1‑based
  const [year, setYear] = useState(today.getFullYear());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [datesLoading, setDatesLoading] = useState(false);

  /* ----------------------- загрузка свободных дат ---------------------- */
  useEffect(() => {
    if (!form.serviceIds.length) return;
    const service_id = form.serviceIds;

    const load = async () => {
      setDatesLoading(true);
      try {
        const res = await fetch(
          `${NEXT_PUBLIC_API_URL}/available-dates/?month=${month}&year=${year}&service_ids=${service_id}`
        );
        const data = await res.json();
        setAvailableDates(data.available_dates ?? []);
      } catch (e) {
        console.error(e);
        setAvailableDates([]);
      } finally {
        setDatesLoading(false);
      }
    };
    load();
  }, [month, year, form.serviceIds]);

  /* ------------------------------ helpers ------------------------------ */
  const fade = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  } as const;

  // types
type FlatService = {
  id: number;
  name: string;
  is_long: boolean;
  parent?: { id: number; name: string }; // если это additional_service
};

const flatSelected = useMemo<FlatService[]>(() => {
  const arr: FlatService[] = [];

  services.forEach((parent) => {
    // сам parent
    if (form.serviceIds.includes(parent.id)) {
      arr.push({ ...parent });
    }

    // его additional_services
    parent.additional_services?.forEach((child: any) => {
      if (form.serviceIds.includes(child.id)) {
        arr.push({
          ...child,
          parent: { id: parent.id, name: parent.name },
        });
      }
    });
  });

  return arr;
}, [services, form.serviceIds]);

// true, если хотя бы одна из выбранных is_long
const isLongService = useMemo(
  () => flatSelected.some((s) => s.is_long),
  [flatSelected]
);

// группируем по parent.id  →  { parent, children[] }
const grouped = useMemo(() => {
  const map = new Map<number, { parent: FlatService; children: FlatService[] }>();

  flatSelected.forEach((s) => {
    if (s.parent) {
      // это additional_service
      const g = map.get(s.parent.id) ?? {
        parent: flatSelected.find((p) => p.id === s.parent!.id) || {
          ...s.parent,
          is_long: s.is_long, // чего-нибудь, лишь бы был тип FlatService
        },
        children: [],
      };
      g.children.push(s);
      map.set(s.parent.id, g);
    } else {
      // корневая
      const g = map.get(s.id) ?? { parent: s, children: [] };
      map.set(s.id, g);
    }
  });

  return Array.from(map.values());
}, [flatSelected]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,minimal-ui"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 px-2 font-inter">
        {/* <h1 className="mb-6 text-center text-5xl font-extrabold tracking-wide text-rose-600">
          Ajnails
        </h1> */}

        {/* <div className="flex justify-center">
          <img src={Logo.src} alt="lol" width={200} height={200} />
        </div> */}

        {error && (
          <div className="mx-auto mb-6 max-w-lg rounded-lg border border-rose-200 bg-rose-100 p-4 text-center text-rose-800">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* -------------------- ШАГ 1: УСЛУГИ -------------------- */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={fade}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-rose-100/50 p-8 lg:p-12">
                {/* Header */}
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center space-x-2 mb-4"
                  >
                    <Crown className="h-6 w-6 text-amber-500" />
                    <span className="text-amber-600 font-semibold uppercase tracking-wider text-sm">
                      Шаг 1 из 3
                    </span>
                  </motion.div>
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                      Выберите услуги
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Откройте для себя мир роскоши и профессионального ухода
                  </p>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                  <Input
                  placeholder="Поиск услуг..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setServicesPage(1); // сбросить на первую страницу при новом запросе
                  }}
                    className="w-full h-14 pl-6 pr-4 text-lg border-2 border-rose-200 rounded-2xl focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all bg-white/70 backdrop-blur-sm"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="h-5 w-5 text-rose-400" />
                  </div>
                </div>

                {/* Services Grid */}
                <div className="grid gap-6 mb-8">
                  {services.map((parent) => (
                    <motion.div 
                      key={parent.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* --- корневая услуга --- */}
                      <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="group"
                      >
                        <label className="block cursor-pointer">
                          <div className={`relative bg-gradient-to-br from-white to-rose-50/30 rounded-2xl p-6 border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                            form.serviceIds.includes(parent.id) 
                              ? 'border-rose-400 bg-gradient-to-br from-rose-50 to-amber-50 shadow-rose-200/50' 
                              : 'border-rose-100 hover:border-rose-300'
                          }`}>
                            {/* Service Icon */}
                            <div className="flex items-start space-x-4">
                              <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                form.serviceIds.includes(parent.id)
                                  ? 'bg-gradient-to-br from-rose-500 to-amber-500 text-white'
                                  : 'bg-gradient-to-br from-rose-100 to-amber-100 text-rose-600 group-hover:from-rose-200 group-hover:to-amber-200'
                              }`}>
                                <Star className="h-8 w-8" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-rose-700 transition-colors">
                                      {parent.name}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                      <span className="flex items-center">
                                        <Award className="h-4 w-4 mr-1 text-amber-500" />
                                        {parent.duration} мин
                                      </span>
                                    </div>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                                      {Number(parent.price)} С
                                    </div>
                                  </div>
                                  
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                    form.serviceIds.includes(parent.id)
                                      ? 'border-rose-500 bg-rose-500'
                                      : 'border-gray-300 group-hover:border-rose-400'
                                  }`}>
                                    {form.serviceIds.includes(parent.id) && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-3 h-3 bg-white rounded-full"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Selection overlay */}
                            {form.serviceIds.includes(parent.id) && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-amber-500/10 rounded-2xl pointer-events-none"
                              />
                            )}
                          </div>
                          
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={form.serviceIds.includes(parent.id)}
                            onChange={() =>
                              setForm((f) => ({
                                ...f,
                                serviceIds: f.serviceIds.includes(parent.id)
                                  ? f.serviceIds.filter((id) => id !== parent.id)
                                  : [...f.serviceIds, parent.id],
                              }))
                            }
                          />
                        </label>
                      </motion.div>

                      {/* --- дочерние (additional_services) --- */}
                      {parent.additional_services?.map((child: any, index: number) => (
                        <motion.div
                          key={child.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01, x: 4 }}
                          className="ml-8 group"
                        >
                          <label className="block cursor-pointer">
                            <div className={`relative bg-gradient-to-br from-white to-amber-50/20 rounded-xl p-4 border-l-4 border-2 transition-all duration-300 ${
                              form.serviceIds.includes(child.id)
                                ? 'border-l-amber-500 border-amber-200 bg-gradient-to-br from-amber-50/50 to-rose-50/30 shadow-lg'
                                : 'border-l-amber-200 border-amber-100 hover:border-l-amber-400 hover:border-amber-200 hover:shadow-md'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                  form.serviceIds.includes(child.id)
                                    ? 'bg-gradient-to-br from-amber-500 to-rose-500 text-white'
                                    : 'bg-gradient-to-br from-amber-100 to-rose-100 text-amber-600 group-hover:from-amber-200 group-hover:to-rose-200'
                                }`}>
                                  <Sparkles className="h-5 w-5" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-semibold text-gray-800 group-hover:text-amber-700 transition-colors">
                                        {child.name}
                                      </h4>
                                      <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                                        <span>{child.duration} мин</span>
                                        <span className="font-bold text-amber-600">
                                          {Number(child.price)} С
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                      form.serviceIds.includes(child.id)
                                        ? 'border-amber-500 bg-amber-500'
                                        : 'border-gray-300 group-hover:border-amber-400'
                                    }`}>
                                      {form.serviceIds.includes(child.id) && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          className="w-2 h-2 bg-white rounded-full"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={form.serviceIds.includes(child.id)}
                              onChange={() =>
                                setForm((f) => ({
                                  ...f,
                                  serviceIds: f.serviceIds.includes(child.id)
                                    ? f.serviceIds.filter((id) => id !== child.id)
                                    : [...f.serviceIds, child.id],
                                }))
                              }
                            />
                          </label>
                        </motion.div>
                      ))}
                    </motion.div>
                  ))}
                </div>

                {/* ---------- ПАГИНАЦИЯ ---------- */}
                <div className="flex items-center justify-between mb-8 p-4 bg-rose-50/50 rounded-2xl">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={servicesPage === 1 || loading}
                    onClick={() => setServicesPage((p) => p - 1)}
                    className="px-6 py-3 bg-white border-2 border-rose-200 text-rose-600 rounded-xl hover:border-rose-400 hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    ‹ Пред
                  </motion.button>

                  <div className="flex items-center space-x-2">
                    {Array.from({ length: totalServicePages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setServicesPage(page)}
                        className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                          page === servicesPage
                            ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-rose-100 hover:text-rose-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <span className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg">
                    {servicesPage} / {totalServicePages || 1}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={servicesPage === totalServicePages || loading}
                    onClick={() => setServicesPage((p) => p + 1)}
                    className="px-6 py-3 bg-white border-2 border-rose-200 text-rose-600 rounded-xl hover:border-rose-400 hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    След ›
                  </motion.button>
                </div>

                {/* Selected Services Summary */}
                {form.serviceIds.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl border border-rose-200"
                  >
                    <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center">
                      <Crown className="h-5 w-5 text-amber-500 mr-2" />
                      Выбранные услуги ({form.serviceIds.length})
                    </h3>
                    <div className="space-y-2">
                      {grouped.map(({ parent, children }) => (
                        <div key={parent.id} className="text-sm">
                          <span className="font-semibold text-rose-700">{parent.name}</span>
                          {children.length > 0 && (
                            <div className="ml-4 text-amber-600">
                              {children.map((c) => (
                                <div key={c.id}>+ {c.name}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Continue Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  disabled={loading || !form.serviceIds.length}
                  className="w-full py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>Продолжить</span>
                  <Crown className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* -------------------- ШАГ 2: ДАТА / МАСТЕР / ВРЕМЯ -------------------- */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={fade}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <Card>
                <h2 className="mb-6 text-center text-2xl font-semibold uppercase tracking-wide text-pink-600">
                  2. Выберите дату
                </h2>

                {/* ------------------- календарь ------------------- */}
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <button
                      onClick={() =>
                        setMonth((m) =>
                          m === 1 ? (setYear((y) => y - 1), 12) : m - 1
                        )
                      }
                      className="px-2 text-2xl"
                    >
                      ‹
                    </button>
                    <span className="font-medium">
                      {new Date(year, month - 1).toLocaleDateString("ru-RU", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() =>
                        setMonth((m) =>
                          m === 12 ? (setYear((y) => y + 1), 1) : m + 1
                        )
                      }
                      className="px-2 text-2xl"
                    >
                      ›
                    </button>
                  </div>

                  {datesLoading ? (
                    <p className="py-6 text-center text-gray-500">
                      Загружаю даты…
                    </p>
                  ) : availableDates.length === 0 ? (
                    <p className="py-6 text-center text-yellow-600">
                      Нет свободных дат
                    </p>
                  ) : (
                    <>
                      <div className="mb-1 grid grid-cols-7 select-none gap-2 text-center text-sm text-gray-500">
                        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
                          <span key={d}>{d}</span>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {(() => {
                          const elems: JSX.Element[] = [];
                          const jsFirstDay = new Date(
                            year,
                            month - 1,
                            1
                          ).getDay();
                          const firstDay = (jsFirstDay + 6) % 7; // делаем понедельник первым

                          for (let i = 0; i < firstDay; i++)
                            elems.push(<div key={"empty-" + i} />);

                          const lastDay = new Date(year, month, 0).getDate();
                          for (let day = 1; day <= lastDay; day++) {
                            const iso = `${year}-${String(month).padStart(
                              2,
                              "0"
                            )}-${String(day).padStart(2, "0")}`;
                            const isEnabled = availableDates.includes(iso);
                            const isSelected = form.date === iso;

                            elems.push(
                              <button
                                key={iso}
                                disabled={!isEnabled}
                                onClick={() => {
                                  setForm((f) => ({
                                    ...f,
                                    date: iso,
                                    time: "",
                                  }));
                                  setSlots(null);
                                  setSelectedMaster(null);
                                }}
                                className={`aspect-square w-full rounded-md text-sm ${
                                  isEnabled
                                    ? isSelected
                                      ? "bg-rose-600 text-white"
                                      : "bg-gray-100 hover:bg-rose-100"
                                    : "cursor-not-allowed bg-gray-50 text-gray-400"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          }
                          return elems;
                        })()}
                      </div>
                    </>
                  )}
                </div>

                {isLongService && (
                  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                    Эта услуга занимает много времени. После записи
                    администратор свяжется с&nbsp;вами и уточнит точное время.
                  </div>
                )}

                {dateError && (
                  <p className="mt-2 text-center text-red-600">{dateError}</p>
                )}

                {!loading && noSlots && (
                  <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
                    <p className="text-yellow-700">
                      Нет доступного времени на выбранную дату
                    </p>
                  </div>
                )}

                {!loading && slots && slots?.masters.length > 0 && (
                  <div className="px-2 py-2 overflow-y-auto">
                    <MasterList
                      loading={loading}
                      slots={slots}
                      onSelect={(master, time) => {
                        setForm((f) => ({ ...f, time: time ?? "" }));
                        setSelectedMaster(master);
                      }}
                    />
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-pink-300 text-pink-600 hover:bg-pink-50 transition"
                  >
                    Назад
                  </Button>

                  <Button
                    onClick={() => setStep(5)}
                    disabled={isLongService ? !selectedMaster : !form.time}
                    className="rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 px-6 py-2 text-white shadow hover:opacity-90 transition"
                  >
                    Далее
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* -------------------- ШАГ 5: ДАННЫЕ КЛИЕНТА -------------------- */}
          {step === 5 && (
            <motion.div
              key="step5"
              variants={fade}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <form onSubmit={handleSubmit}>
                <Card className="mx-auto max-w-lg rounded-3xl bg-white bg-opacity-80 p-8 shadow-2xl backdrop-blur-sm">
                  <h2 className="mb-6 text-center text-2xl font-semibold uppercase tracking-wide text-pink-600">
                    3. Ваши данные
                  </h2>

                  {/* ------- резюме ------- */}
                  <div className="mb-6 rounded-lg bg-pink-50 p-4 leading-relaxed text-gray-700">
                  <p className="mb-2 font-semibold">Услуги:</p>
                    <ul className="list-disc space-y-1 pl-5">
                      {grouped.map(({ parent, children }) => (
                        <li key={parent.id}>
                          {parent.name}
                          {children.length > 0 && (
                            <ul className="list-disc pl-5 text-sm text-rose-700">
                              {children.map((c) => (
                                <li key={c.id}>{c.name}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                    <p>
                      <strong>Дата:</strong> {form.date}
                      {!isLongService && form.time && (
                        <>
                          {" "}
                          <strong>Время:</strong> {form.time}
                        </>
                      )}
                      {isLongService && (
                        <span className="text-sm text-gray-500">
                          {" "}
                          (точное время сообщит администратор)
                        </span>
                      )}
                    </p>
                    <p>
                      <strong>Мастер:</strong> {selectedMaster?.name}
                    </p>
                  </div>

                  {/* ------- поля ------- */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="clientName">Ваше имя</Label>
                      <Input
                        id="clientName"
                        value={form.clientName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, clientName: e.target.value }))
                        }
                        required
                        className="w-full border-pink-300 focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="reminder">Напомнить за:</Label>
                      <Select
                        value={String(form.reminder_minutes)}
                        onValueChange={(val) =>
                          setForm((f) => ({
                            ...f,
                            reminder_minutes: Number(val),
                          }))
                        }
                      >
                        <SelectTrigger className="w-full border-pink-300 focus:border-pink-500">
                          <SelectValue placeholder="Выберите интервал" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">За 30 минут</SelectItem>
                          <SelectItem value="60">За 1 час</SelectItem>
                          <SelectItem value="120">За 2 часа</SelectItem>
                          <SelectItem value="180">За 3 часа</SelectItem>
                          <SelectItem value="1440">За 1 день</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="relative w-full">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 select-none text-gray-500">
                        +996
                      </span>
                      <Input
                        type="tel"
                        value={form.clientPhone.slice(3)}
                        onChange={(e) => {
                          const digits = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 9);
                          setForm((f) => ({
                            ...f,
                            clientPhone: "996" + digits,
                          }));
                        }}
                        maxLength={9}
                        placeholder="XXX XXX XXX"
                        className="pl-16 border-pink-300 focus:border-pink-500"
                        required
                      />
                    </div>
                  </div>

                  {/* ------- чекбоксы ------- */}
                  <div className="mt-6 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="acceptOffer"
                      checked={form.acceptOffer}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          acceptOffer: e.target.checked,
                        }))
                      }
                      required
                      className="h-5 w-5 shrink-0 rounded-none accent-pink-500"
                    />
                    <label htmlFor="acceptOffer" className="text-sm leading-5">
                      Я принимаю условия&nbsp;
                      <a
                        href="/docs/offer-v1.0.docx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 underline hover:text-pink-700"
                      >
                        договора-оферты
                      </a>
                    </label>
                  </div>

                  <div className="mt-6 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="acceptPolicy"
                      checked={form.conf}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, conf: e.target.checked }))
                      }
                      required
                      className="h-5 w-5 shrink-0 rounded-none accent-pink-500"
                    />
                    <label htmlFor="acceptPolicy" className="text-sm leading-5">
                      Я принимаю условия&nbsp;
                      <a
                        href="/docs/offer-v2.0.docx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 underline hover:text-pink-700"
                      >
                        политики конфиденциальности
                      </a>
                    </label>
                  </div>

                  {/* ------- кнопки ------- */}
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
                    <Button
                      type="submit"
                      disabled={
                        submitting ||
                        loading ||
                        !form.clientName ||
                        !form.clientPhone ||
                        !form.acceptOffer ||
                        !form.conf
                      }
                      className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 px-8 py-2 text-lg font-bold text-white shadow-lg transition hover:opacity-90 sm:w-auto"
                    >
                      {submitting ? "Отправка..." : "Подтвердить"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="w-full border-pink-300 text-pink-600 transition hover:bg-pink-50 sm:w-auto"
                    >
                      Назад
                    </Button>
                  </div>

                  {/* ------- логотип ------- */}
                  {/* <div className="mt-8 flex justify-center">
                    <Image src={Logo} alt="logo" />
                  </div> */}
                </Card>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      

        {/* логотип внизу для шага 1/2 */}
      </div>
    </>
  );
}
