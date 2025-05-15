package com.fs.htmlclient;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;

import androidx.annotation.Nullable;

import com.fs.htmlclient.plugins.webviewcache.WebViewCachePlugin;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(WebViewCachePlugin.class);
    super.onCreate(savedInstanceState);
    this.hideSystemUI();
  }

  @Override
  protected void onPostCreate(@Nullable @org.jetbrains.annotations.Nullable Bundle savedInstanceState) {
    super.onPostCreate(savedInstanceState);
  }

  private void hideSystemUI() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      final WindowManager.LayoutParams params = getWindow().getAttributes();
      params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_NEVER;
      getWindow().setAttributes(params);
    }

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
      final int flags = (
        View.SYSTEM_UI_FLAG_FULLSCREEN
          | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
          | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
          // | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
          // | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
          | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
      );

      getWindow().getDecorView().setSystemUiVisibility(flags);
    }
  }
}
