import React from 'react';
import { DataProvider } from '@plasmicapp/loader-nextjs';
import { useLocale } from '@/contexts/LocaleContext';
import { useRouter } from 'next/router';

interface LocaleToggleWrapperProps {
  children?: React.ReactNode;
}

interface LocaleToggleWrapperActions {
  setLocale(locale: string): void;
}

const LocaleToggleWrapperBase = ({ children }: LocaleToggleWrapperProps, ref: React.Ref<unknown>) => {
  const { locale, setLocale } = useLocale();
  const router = useRouter();

  React.useImperativeHandle(ref, () => ({
    setLocale: (newLocale: string) => {
      // Mettre à jour le contexte React
      setLocale(newLocale);
      
      // Forcer le rechargement pour que Plasmic prenne en compte le nouveau variant
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
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