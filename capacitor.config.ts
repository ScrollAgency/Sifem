import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.sifem.dpei-pocket',
  appName: 'Sifem',
  webDir: 'out',
  plugins: {
    Share: {
      subject: 'Export from Sifem',
      dialogTitle: 'Partager le fichier'
    },
    Filesystem: {
      directory: 'DOCUMENTS'
    }
  }
};

export default config;
