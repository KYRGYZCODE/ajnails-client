import { useState, useEffect } from 'react';
import { getServices, getEmployees } from '../api';

export const useServiceAndMasters = () => {
  const [services, setServices] = useState<Record<string, string>>({});
  const [masters, setMasters] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, employeesData] = await Promise.all([
          getServices(),
          getEmployees()
        ]);

        const servicesMap = servicesData.reduce((acc: Record<string, string>, service: any) => {
          acc[service.id] = service.name;
          return acc;
        }, {});

        const mastersMap = employeesData.reduce((acc: Record<string, string>, master: any) => {
          acc[master.id] = `${master.first_name} ${master.last_name}`;
          return acc;
        }, {});

        setServices(servicesMap);
        setMasters(mastersMap);
      } catch (error) {
        console.error('Error fetching services or masters:', error);
      }
    };

    fetchData();
  }, []);

  return { services, masters };
};
