import { configureStore } from '@reduxjs/toolkit';
import appointmentReducer from '@/app/lib/redux/slices/appointmentSlice';
import serviceReducer from '@/app/lib/redux/slices/serviceSlice';

export const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    services: serviceReducer,
    
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
