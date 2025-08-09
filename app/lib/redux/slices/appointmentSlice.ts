import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment } from '@/hooks/types';

export interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
};

const saveAppointmentsToStorage = (appointments: Appointment[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userAppointments', JSON.stringify(appointments));
  }
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
      saveAppointmentsToStorage(action.payload);
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
      saveAppointmentsToStorage(state.appointments);
    },
    removeAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(app => app.id !== action.payload);
      saveAppointmentsToStorage(state.appointments);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAppointments, addAppointment, removeAppointment, setLoading, setError } = appointmentSlice.actions;
export default appointmentSlice.reducer;