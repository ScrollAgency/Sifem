import React, { createContext, useContext } from "react";

type Lesion = { id: number; name_fr: string };
type Option = { id: number; name_fr: string };

interface LesionOptionContextValue {
  lesions: Lesion[];
  options: Option[];
}

const LesionOptionContext = createContext<LesionOptionContextValue | undefined>(undefined);

export const LesionOptionProvider: React.FC<{
  lesions: Lesion[];
  options: Option[];
  children: React.ReactNode;
}> = ({ lesions, options, children }) => {
  return (
    <LesionOptionContext.Provider value={{ lesions, options }}>
      {children}
    </LesionOptionContext.Provider>
  );
};

export const useLesionOptionContext = (): LesionOptionContextValue => {
  const ctx = useContext(LesionOptionContext);
  if (!ctx) {
    throw new Error("useLesionOptionContext must be used inside LesionOptionProvider");
  }
  return ctx;
};
