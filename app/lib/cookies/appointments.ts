import { v4 as uuidv4 } from 'uuid';

const APPOINTMENTS_STORAGE_KEY = 'ajnails_appointments';

export interface StoredAppointment {
  id: string;
  clientName: string;
  clientPhone: string;
  dateTime: string;
  master: number; 
  services: number[]; 
  createdAt: string;
  masterName?: string;
}

export function getStoredAppointments(): StoredAppointment[] {
if (typeof window === 'undefined') {
    return [];
  }
  
  const appointmentsStorage = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
  console.log('appointmentsStorage', appointmentsStorage);
  
  if (!appointmentsStorage) {
    return [];
  }

  try {
    return JSON.parse(appointmentsStorage);
  } catch (error) {
    console.error('Error parsing appointments from localStorage:', error);
    return [];
  }
}

export function storeAppointment(appointment: Omit<StoredAppointment, 'id' | 'createdAt'>): StoredAppointment {
  const storedAppointments = getStoredAppointments();
  
  const newAppointment: StoredAppointment = {
    ...appointment,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };

  const updatedAppointments = [...storedAppointments, newAppointment];

  if (typeof window !== 'undefined') {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));
  }

  return newAppointment;
}

export function removeAppointment(appointmentId: string): boolean {
  const storedAppointments = getStoredAppointments();
  
  const updatedAppointments = storedAppointments.filter(
    appointment => appointment.id !== appointmentId
  );

  if (updatedAppointments.length === storedAppointments.length) {
    return false;
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));
  }

  return true;
}