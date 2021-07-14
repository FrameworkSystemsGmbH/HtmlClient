// eslint-disable-next-line spaced-comment
/// <reference types="@capacitor/splash-screen" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fs.htmlclient',
  appName: 'Mobile Client',
  loggingBehavior: 'production',
  webDir: 'dist/build/prod',
  plugins: {
    SplashScreen: {
      'androidScaleType': 'FIT_CENTER',
      'launchAutoHide': false,
      'backgroundColor': '#ffffff',
      'splashFullScreen': true,
      'splashImmersive': true
    }
  }
};

export default config;
