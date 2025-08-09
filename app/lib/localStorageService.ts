const APPOINTMENTS_KEY = 'ajnails_appointments';

export interface StoredAppointment {
  id: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  masterId: string;
  serviceId: string;
  status: string;
}

export const saveAppointment = (appointment: StoredAppointment): void => {
  if (typeof window !== 'undefined') {
    const existingAppointments = getAppointments();
    existingAppointments.push(appointment);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(existingAppointments));
  }
};

export const getAppointments = (): StoredAppointment[] => {
  if (typeof window !== 'undefined') {
    const appointmentsJson = localStorage.getItem(APPOINTMENTS_KEY);
    return appointmentsJson ? JSON.parse(appointmentsJson) : [];
  }
  return [];
};

export const clearAppointments = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(APPOINTMENTS_KEY);
  }
};