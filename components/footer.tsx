"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-10 py-6 text-center text-gray-600 text-sm">
      <div className="max-w-xl mx-auto space-y-1">
        <div>ФИО ИНН: </div>
        <div>
          Адрес:  –&nbsp;
          <a
            href="https://go.2gis.com/ZttEH"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-800"
          >
            смотреть на 2GIS
          </a>
        </div>
        <div>Контакты: +996 000-00-00-00</div>
      </div>
    </footer>
  );
};

export default Footer;
