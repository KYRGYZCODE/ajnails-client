import { useState, useEffect } from 'react';
import { getStoredAppointments, StoredAppointment } from '@/app/lib/cookies/appointments';

export const useLeads = () => {
  const [leads, setLeads] = useState<StoredAppointment[]>([]);

  useEffect(() => {
    const stored = getStoredAppointments();
    setLeads(stored);
  }, []);

  return leads;
};
