import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { addAppointment } from "@/app/lib/redux/slices/appointmentSlice";
import { saveAppointment } from "@/app/lib/localStorageService";
import {
  fetchServices,
  fetchAvailableMasters,
  fetchAvailableSlots,
  createAppointment,
} from "../api/bookingClient";
import { Appointment } from "@/hooks/types";

/* ------------------------------------------------------------------
 *  TYPES
 * ------------------------------------------------------------------*/
export interface Service {
  id: number;
  name: string;
  duration: number;
  price: string | number;   // было: number
  is_long: boolean;
  additional_services?: any
  is_additional: boolean
  parent_service: number | null
}


export interface Master {
  uuid: string;
  first_name: string;
  last_name: string;
}

export interface MasterSlots {
  uuid: string;
  name: string;
  avatar: string | null;
  available_slots: string[];
}

export interface Slots {
  date: string;
  service_id: string;
  is_long_service: boolean;
  masters: MasterSlots[];
}

interface BookingForm {
  clientName: string;
  clientPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  serviceIds: any[];
  reminder_minutes: number;
  acceptOffer: boolean;
  conf: boolean;
}

/* -------------------- НАСТРОЙКИ -------------------- */
const SERVICES_LIMIT = 8; // Кол-во услуг на страницу
/* --------------------------------------------------- */

export function useBooking() {
  const router = useRouter();
  const dispatch = useDispatch();

  /* ----------- Услуги + пагинация ----------- */
  const [services, setServices] = useState<Service[]>([]);
  const [servicesCount, setServicesCount] = useState(0);
  const [servicesPage, setServicesPage] = useState(1);
  const totalServicePages = Math.max(1, Math.ceil(servicesCount / SERVICES_LIMIT));

  /* ------------- Состояние мастеров / слотов ------------- */
  const [masters, setMasters] = useState<Master[]>([]);
  const [slots, setSlots] = useState<Slots | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<MasterSlots | null>(null);

  /* ------------- Разное состояние ------------- */
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noMasters, setNoMasters] = useState(false);
  const [noSlots, setNoSlots] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");

  /* ------------- Форма бронирования ------------- */
  const [form, setForm] = useState<BookingForm>({
    clientName: "",
    clientPhone: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    serviceIds: [],
    reminder_minutes: 30,
    acceptOffer: false,
    conf: false,
  });

  /* ------------------------------------------------------------------
   *  ЗАГРУЗКА УСЛУГ С ПАГИНАЦИЕЙ
   * ----------------------------------------------------------------*/
  const loadServices = useCallback(
    async (page = servicesPage) => {
      try {
        setLoading(true);
        // Передаём searchTerm
        const { results, count } = await fetchServices(
          page,
          SERVICES_LIMIT,
          searchTerm
        );
        const normalized = results.map(r => ({
          ...r,
          price: Number(r.price),
        })) as Service[];
        setServices(normalized);
        setServicesCount(count);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Ошибка при загрузке услуг");
        toast({ title: "Ошибка", description: e?.message });
      } finally {
        setLoading(false);
      }
    },
    [servicesPage, searchTerm] // теперь зависим от searchTerm
  );


  // первый запрос + повтор при смене страницы
  useEffect(() => {
    loadServices(servicesPage);
  }, [servicesPage, searchTerm, loadServices]);

  /* ------------------------------------------------------------------
   *  ПОИСК ВРЕМЕННЫХ СЛОТОВ
   * ----------------------------------------------------------------*/
  const findSlots = useCallback(async () => {
    if (!form.serviceIds.length || !form.date) {
      toast({ title: "Ошибка", description: "Выберите услугу и дату" });
      return false;
    }
    setError(null);
    setNoSlots(false);
    setSlots(null);

    try {
      setLoading(true);
      const list = await fetchAvailableSlots(form.serviceIds, form.date);
      setSlots(list);
      if (!list || list.masters.length === 0) {
        setNoSlots(true);
      }
      return true;
    } catch (err: any) {
      console.error(err);
      setNoSlots(true);
      toast({ title: "Ошибка", description: err?.message || "Не удалось загрузить слоты" });
      return false;
    } finally {
      setLoading(false);
    }
  }, [form]);

  /* ------------------------------------------------------------------
   *  ЗАГРУЗКА МАСТЕРОВ ДЛЯ КОНКРЕТНОГО СЛОТА
   * ----------------------------------------------------------------*/
  const fetchMasters = useCallback(async () => {
    if (!form.serviceIds.length || !form.date || !form.time) {
      toast({ title: "Ошибка", description: "Выберите услугу, дату и время" });
      return false;
    }
    setError(null);
    setNoMasters(false);
    setMasters([]);

    try {
      setLoading(true);
      const list = await fetchAvailableMasters(
        form.serviceIds,
        form.date,
        form.time
      );
      setMasters(list);
      if (!list.length) setNoMasters(true);
      return true;
    } catch (e: any) {
      console.error(e);
      setError("Не удалось получить мастеров");
      toast({ title: "Ошибка", description: e?.message || "Не удалось получить мастеров" });
      return false;
    } finally {
      setLoading(false);
    }
  }, [form]);

  /* ------------------------------------------------------------------
   *  ОТПРАВКА ФОРМЫ / СОЗДАНИЕ ЗАПИСИ
   * ----------------------------------------------------------------*/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (
      !form.clientName ||
      !form.clientPhone ||
      !form.date ||
      !form.serviceIds.length ||
      (!form.time && !selectedMaster?.available_slots?.length) ||
      !selectedMaster
    ) {
      toast({ title: "Ошибка", description: "Заполните все поля" });
      setSubmitting(false);
      return;
    }

    try {
      const localDateTime = `${form.date}T${form.time || selectedMaster.available_slots[0]}:00`;

      await createAppointment({
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        date: localDateTime,
        masterUuid: selectedMaster.uuid,
        serviceIds: form.serviceIds,
      });

      const newAppointment: Appointment = {
        id: Date.now().toString(),
        serviceIds: form.serviceIds,
        masterId: selectedMaster.uuid,
        dateTime: localDateTime.replace("T", " "),
        clientName: form.clientName,
        masterName: selectedMaster.name || `${selectedMaster.name}`,
        services: services
          .filter((s) => form.serviceIds.includes(s.id))
          .map((s) => s.name),
        clientPhone: form.clientPhone,
        status: "pending",
      } as Appointment;

      saveAppointment(newAppointment as any);
      dispatch(addAppointment(newAppointment));

      toast({ title: "Успешно!", description: "Запись создана успешно ✨" });
      // router.push("/appointments");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Ошибка записи");
      toast({ title: "Ошибка", description: err?.message || "Не удалось создать запись" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------
   *  ЭФФЕКТЫ
   * ----------------------------------------------------------------*/
  useEffect(() => {
    // обновляем слоты при смене даты или услуги
    if (!form.date || !form.serviceIds.length) return;
    findSlots();
    setSelectedMaster(null);
    setForm((prev) => ({ ...prev, time: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.date, form.serviceIds]);

  /* ------------------------------------------------------------------
   *  ПУБЛИЧНЫЙ API ХУКА
   * ----------------------------------------------------------------*/
  return {
    /* услуги + пагинация */
    services,
    servicesPage,
    totalServicePages,
    setServicesPage,

    /* мастера / слоты */
    masters,
    setMasters,
    slots,
    setSlots,
    noMasters,
    noSlots,
    selectedMaster,
    setSelectedMaster,

    /* состояние */
    loading,
    submitting,
    error,

    /* форма */
    form,
    setForm,

    /* методы */
    findSlots,
    fetchMasters,
    handleSubmit,
    searchTerm,
    setSearchTerm,

  } as const;
}
