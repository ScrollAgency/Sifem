import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.sifem.dpei_pocket',
  appName: 'dPEI Pocket',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
