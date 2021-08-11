package com.fs.htmlclient;

import android.graphics.Rect;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;

import androidx.annotation.Nullable;

import com.fs.htmlclient.plugins.webviewcache.WebViewCachePlugin;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  private View view;
  private int viewRenderHeight;
  private FrameLayout.LayoutParams frameLayoutParams;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(WebViewCachePlugin.class);
    this.hideSystemUI();
  }

  @Override
  protected void onPostCreate(@Nullable @org.jetbrains.annotations.Nullable Bundle savedInstanceState) {
    super.onPostCreate(savedInstanceState);

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
      this.attachSizeObserver();
    }
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
          | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
          | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
          | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
      );

      getWindow().getDecorView().setSystemUiVisibility(flags);
    }
  }

  private void attachSizeObserver() {
    FrameLayout content = this.findViewById(android.R.id.content);
    view = content.getChildAt(0);
    view.getViewTreeObserver().addOnGlobalLayoutListener(this::contentSizeChanged);
    frameLayoutParams = (FrameLayout.LayoutParams) view.getLayoutParams();
  }

  private void contentSizeChanged() {
    Rect r = new Rect();
    view.getRootView().getWindowVisibleDisplayFrame(r);

    int statusBarHeight = r.top;
    int usableHeightNow = r.bottom - r.top;

    if (usableHeightNow != viewRenderHeight) {
      int usableHeightSansKeyboard = view.getRootView().getHeight();
      int heightDifference = usableHeightSansKeyboard - usableHeightNow;

      if (heightDifference > (usableHeightSansKeyboard / 4)) {
        // keyboard just became visible
        frameLayoutParams.topMargin = statusBarHeight;
        frameLayoutParams.height = usableHeightNow;
      } else {
        // keyboard just became hidden
        frameLayoutParams.topMargin = 0;
        frameLayoutParams.height = usableHeightSansKeyboard;
        // status bar and navigation bar don't hide themselves after keyboard was closed
        this.hideSystemUI();
      }

      view.requestLayout();
      viewRenderHeight = usableHeightNow;
    }
  }
}
