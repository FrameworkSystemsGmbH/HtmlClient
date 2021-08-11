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
      'showSpinner': false
    }
  }
};

export default config;
