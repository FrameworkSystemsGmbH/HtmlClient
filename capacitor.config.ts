// eslint-disable-next-line spaced-comment
/// <reference types="@capacitor/splash-screen" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fs.htmlclient',
  appName: 'Mobile Client',
  webDir: 'dist/build/prod',
  plugins: {
    SplashScreen: {
      'launchAutoHide': false,
      'backgroundColor': '#ffffff',
      'splashImmersive': true
    }
  }
};

export default config;
