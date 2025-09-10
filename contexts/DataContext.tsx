import React, { createContext, useContext, useEffect, useState } from "react";
import { ShapeStream, Shape } from "@electric-sql/client";
import { useElectricSeed } from "@/hook/useElectricSeed";

// Types
type Lesion = {
  id: number;
  name_fr: string;
  category_fr?: string;
  type?: string;
  status?: string;
};
type Option = {
  id: number;
  name_fr: string;
};

// Context
const DataContext = createContext<{
  lesions: Lesion[];
  options: Option[];
  loading: boolean;
}>({ lesions: [], options: [], loading: true });

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [lesions, setLesions] = useState<Lesion[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  // Appel du seed SQL désactivé (à réactiver si tu as une instance de DB locale)
  // useElectricSeed(undefined);

  useEffect(() => {
    // Lesions
    const lesionStream = new ShapeStream({
      url: 'http://localhost:5133/v1/shape',
      params: { table: 'lesion' },
    });
    const lesionShape = new Shape(lesionStream);
    lesionShape.rows.then((rows) => {
      setLesions((rows as Lesion[]) ?? []);
      setLoading(false);
    });
    const unsubLesion = lesionShape.subscribe(({ rows }) => {
      setLesions((rows as Lesion[]) ?? []);
    });

    // Options
    const optionStream = new ShapeStream({
      url: 'http://localhost:5133/v1/shape',
      params: { table: 'option' },
    });
    const optionShape = new Shape(optionStream);
    optionShape.rows.then((rows) => {
      setOptions((rows as Option[]) ?? []);
      setLoading(false);
    });
    const unsubOption = optionShape.subscribe(({ rows }) => {
      setOptions((rows as Option[]) ?? []);
    });

    return () => {
      unsubLesion();
      unsubOption();
    };
  }, []);


  return (
    <DataContext.Provider value={{ lesions, options, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);