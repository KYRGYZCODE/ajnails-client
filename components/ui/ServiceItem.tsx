import { Service } from '@/app/types';
import React from 'react'

type ServiceItemProps = {
    service: any;           // ваш интерфейс
    isChild?: boolean;
    checked: boolean;
    onToggle: () => void;
  };  

export const ServiceItem: React.FC<ServiceItemProps> = ({ checked, onToggle, service, isChild }) => {
  return (
    <label
    key={service.id}
    className={`flex cursor-pointer ${isChild ? "pl-6 border-l-2 border-pink-200" : ""}`}
  >
    <div className="flex-1">
      <div className="text-base text-black">{service.name}</div>

      <div className="mt-1 text-sm text-gray-500">
        {service.duration} мин
      </div>

      <div className="mt-2 text-base font-semibold text-black">
        {Number(service.price)}&nbsp;С
      </div>
    </div>

    <input
      type="checkbox"
      className="h-5 w-5 rounded-none accent-pink-500"
      checked={checked}
      onChange={onToggle}
    />
  </label>
  )
}
