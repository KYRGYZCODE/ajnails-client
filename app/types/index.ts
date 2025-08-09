export type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
};

export type Specialist = {
  id: string;
  name: string;
  photo: string;
  specialization: string[];
  services: string[];
};

export type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  service: number;
  master: string;
  date_time: string;
};

export type CreateAppointmentDto = {
  client_name: string;
  client_phone: string;
  date_time: string;
  master: string;
  service: number;
};