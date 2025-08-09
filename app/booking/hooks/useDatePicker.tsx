// hooks/useBookingSteps.ts
import { useState, useEffect } from 'react';
import { DayPickerProps } from 'react-day-picker';

export function useBookingSteps(initialStep = 1) {
  const [step, setStep] = useState(initialStep);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    setTempDate(new Date());
  }, []);

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setTempDate(date);
    }
  };

  const handleDateConfirm = () => {
    if (tempDate) {
      setIsCalendarOpen(false);
      return tempDate.toISOString();
    }
    return null;
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const dayPickerProps: DayPickerProps = {
    mode: 'single',
    fromYear: new Date().getFullYear(),
    toYear: new Date().getFullYear() + 1,
    captionLayout: 'dropdown',
  };

  return {
    step,
    setStep,
    tempDate,
    setTempDate,
    isCalendarOpen,
    setIsCalendarOpen,
    handleDateSelect,
    handleDateConfirm,
    nextStep,
    prevStep,
    dayPickerProps,
  };
}