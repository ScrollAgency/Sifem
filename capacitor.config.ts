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
      requestPermissions: false  // Utilise les répertoires sans permissions
    },
    Share: {
      enabled: true
    }
  }
};

export default config;
