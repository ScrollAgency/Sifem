import React, { createContext, useContext, useEffect, useState } from "react";
import { ShapeStream, Shape } from "@electric-sql/client";
import { useElectricSeed } from "@/hook/useElectricSeed";
// Les fichiers JSON doivent être placés dans public/ pour être accessibles via fetch

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
    // Chargement des données locales JSON via fetch (public/lesions.json, public/options.json)
    async function loadData() {
      try {
        const lesionsRes = await fetch('/lesions.json');
        const lesionsJson = await lesionsRes.json();
        const optionsRes = await fetch('/options.json');
        const optionsJson = await optionsRes.json();

        // Tri par id
        const sortedLesions = Array.isArray(lesionsJson)
          ? lesionsJson.slice().sort((a, b) => a.id - b.id)
          : [];
        const sortedOptions = Array.isArray(optionsJson)
          ? optionsJson.slice().sort((a, b) => a.id - b.id)
          : [];

        setLesions(sortedLesions);
        setOptions(sortedOptions);
        setLoading(false);
        console.log('DataContext loaded:', {
          lesions: sortedLesions,
          options: sortedOptions
        });
      } catch (e) {
        setLesions([]);
        setOptions([]);
        setLoading(false);
        console.error('Erreur chargement JSON:', e);
      }
    }
    loadData();
  }, []);


  return (
    <DataContext.Provider value={{ lesions, options, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);