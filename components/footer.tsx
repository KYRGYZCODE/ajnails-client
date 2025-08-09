"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-10 py-6 text-center text-gray-600 text-sm">
      <div className="max-w-xl mx-auto space-y-1">
        <div>Толосунова Рахатгул Карыпбековна ИНН: 12010197400244</div>
        <div>
          Адрес: Улица Фрунзе, 300/4 1 этаж –&nbsp;
          <a
            href="https://2gis.kg/bishkek/firm/70000001092518268"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-800"
          >
            смотреть на 2GIS
          </a>
        </div>
        <div>Контакты: +996 755‒47‒03‒86</div>
      </div>
    </footer>
  );
};

export default Footer;
