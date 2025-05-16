import { getCookie, setCookie } from 'cookies-next';
import React from 'react';

// Cookie name for locale preference
const LOCALE_COOKIE_NAME = 'plasmic-locale';

interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
}

const defaultContextValue: LocaleContextType = {
  locale: 'en', // Default to English
  setLocale: () => {}
};

const LocaleContext = React.createContext<LocaleContextType>(defaultContextValue);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState('en');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const savedLocale = getCookie(LOCALE_COOKIE_NAME);
    if (savedLocale) {
      setLocaleState(savedLocale as string);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    setCookie(LOCALE_COOKIE_NAME, newLocale);
  };

  if (!mounted) return null;

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => {
  const context = React.useContext(LocaleContext);
  return context || defaultContextValue;
}; 