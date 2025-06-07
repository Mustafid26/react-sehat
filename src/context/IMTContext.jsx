// context/IMTContext.js
import React, { createContext, useState } from 'react';

export const IMTContext = createContext();

export const IMTProvider = ({ children }) => {
  const [imtData, setImtData] = useState({
    nama: '',
    imt: 0,
    kategori: '',
    beratSehat: '',
  });

  return (
    <IMTContext.Provider value={{ imtData, setImtData }}>
      {children}
    </IMTContext.Provider>
  );
};
