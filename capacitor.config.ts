import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fitflow.app',
  appName: 'FitFlow',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
