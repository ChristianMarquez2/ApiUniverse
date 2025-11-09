import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.apiverse.app',
  appName: 'APIverse',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#000000',
      androidScaleType: 'CENTER_CROP',
      launchAutoHide: true,
      showSpinner: false
    }
  }
};

export default config;
