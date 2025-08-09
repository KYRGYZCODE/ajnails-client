export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    image?: string;
  }
  
  export interface Master {
    uuid: string;
    name: string;
    services: string[];
    experience?: string;
    schedule?: {
      [key: string]: string[];
    };
  }
  
  export interface Appointment {
    id: string;
    serviceIds: number[];
    masterId: string;
    dateTime: string;
    
    services?: string[];
    masterName?: string;
    clientName?: string;
    clientPhone?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
  }
  