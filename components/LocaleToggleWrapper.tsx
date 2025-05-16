import React from 'react';
import { DataProvider } from '@plasmicapp/loader-nextjs';
import { useLocale } from '@/contexts/LocaleContext';

interface LocaleToggleWrapperProps {
  children?: React.ReactNode;
}

interface LocaleToggleWrapperActions {
  setLocale(locale: string): void;
}

const LocaleToggleWrapperBase = ({ children }: LocaleToggleWrapperProps, ref: React.Ref<unknown>) => {
  const { locale, setLocale } = useLocale();

  React.useImperativeHandle(ref, () => ({
    setLocale: (newLocale: string) => setLocale(newLocale)
  }));

  return (
    <DataProvider name="locale" data={{ locale }}>
      {children}
    </DataProvider>
  );
};

export const LocaleToggleWrapper = React.forwardRef<LocaleToggleWrapperActions, LocaleToggleWrapperProps>(
  LocaleToggleWrapperBase
); 