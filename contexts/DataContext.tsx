import React, { createContext, useContext, useEffect, useState } from "react";
import { useLesions } from "../hook/useLesions";
import { useOptions } from "../hook/useOptions";

const DataContext = createContext<{
  lesions: any;
  options: any;
  loading: boolean;
}>({ lesions: null, options: null, loading: true });

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
const lesionsState = useLesions();
const optionsState = useOptions();

const loading = lesionsState.loading || optionsState.loading;

return (
  <DataContext.Provider
    value={{
      lesions: lesionsState.data,
      options: optionsState.data,
      loading,
    }}
  >
    {children}
  </DataContext.Provider>
);

};

export const useData = () => useContext(DataContext);
