<<<<<<< HEAD

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ahmed.pharmasource',
  appName: 'pharmasource',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePassword: 'android', // Default, update if you have a custom keystore
      keystoreAlias: 'androiddebugkey',
      keystoreAliasPassword: 'android',
    }
  }
=======
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pharmasource.app',
  appName: 'pharmasource',
  webDir: 'dist'
>>>>>>> 78f14f6 (Fix JSX syntax error in System Log label)
};

export default config;
