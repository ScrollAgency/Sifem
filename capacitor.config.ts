import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.sifem.dpei_pocket',
  appName: 'dPEI Pocket',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    Filesystem: {
      requestPermissions: true,  // Demander les permissions pour accès Downloads
      androidRequestLegacyExternalStorage: true  // Support Android ancien
    },
    Share: {
      enabled: true
    }
  }
};

export default config;
