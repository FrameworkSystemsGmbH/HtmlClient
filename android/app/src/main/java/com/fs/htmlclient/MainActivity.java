package com.fs.htmlclient;

import android.graphics.Rect;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.WebView;

import androidx.activity.EdgeToEdge;
import androidx.annotation.Nullable;
import androidx.core.graphics.Insets;
import androidx.core.view.DisplayCutoutCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

import com.fs.htmlclient.cache.WebViewCacheBridge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  private View rootView;
  private boolean isKeyboardVisible = false;
  private int keyboardHeight = 0;
  private int cutOutOffsetTop = 0;
  private int cutOutOffsetBottom = 0;


  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    EdgeToEdge.enable(this);
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

    rootView = getWindow().getDecorView().getRootView();

    setupWebViewCacheBridge();

    setWindowInsetsListener();

    hideSystemUI();
  }

  /// Setup-Funktion, um die WebviewBridge mit der aktuellen WebView zu verknüpfen.
  /// Die {@link WebViewCacheBridge} kümmert sich um die Bereinigung des Caches der WebView.
  ///
  /// Das ist Teil der Integration des [webview-cache-plugins](https://github.com/FrameworkSystemsGmbH/capacitor-plugin-webview-cache).
  private void setupWebViewCacheBridge() {
    WebView webView = this.bridge.getWebView();
    if (webView != null) {
      webView.addJavascriptInterface(new WebViewCacheBridge(this, webView), "WebViewCache");
    }
  }

  /// Wichtig für Android 10- / API 29-
  @Override
  protected void onPostCreate(@Nullable @org.jetbrains.annotations.Nullable Bundle savedInstanceState) {
    super.onPostCreate(savedInstanceState);

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
      rootView.getViewTreeObserver().addOnGlobalLayoutListener(this::calcKeyboardVisibilityApi26);
      rootView.getViewTreeObserver().addOnGlobalLayoutListener(this::hideSystemUI);
    }
  }

  /// All
  private void setWindowInsetsListener() {
    ViewCompat.setOnApplyWindowInsetsListener(getWindow().getDecorView(), (v, insets) -> {

      offsetForNotches(insets);

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        calcKeyboardVisiblityApi30(insets);
        handleKeyboardOffsets(insets);
      } else {
        calcKeyboardVisibilityApi26();
      }

      int bottomOffset = (isKeyboardVisible) ? keyboardHeight : cutOutOffsetBottom;

      // set Padding after Offsets are calculated
      v.setPadding(0, cutOutOffsetTop, 0, bottomOffset);

      return insets;
    });
  }

  /// All
  private void offsetForNotches(WindowInsetsCompat insets) {
    DisplayCutoutCompat cutout = insets.getDisplayCutout();
    cutOutOffsetBottom = cutOutOffsetTop = 0; // reset to 0

    if (cutout != null && cutout.getSafeInsetTop() > 0) {
      cutOutOffsetTop = cutout.getSafeInsetTop(); // bei cutout / notch
      cutOutOffsetBottom = cutout.getSafeInsetBottom();
    } else {
      // für PunchHoles (geht weil die StatusBar nicht angezeigt wird, sonst doppelter Inset)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        cutOutOffsetTop = insets.getInsets(WindowInsetsCompat.Type.statusBars()).top;
      }
    }
  }

  /// Android 11+ / API 30+
  private void calcKeyboardVisiblityApi30(WindowInsetsCompat insets) {
    isKeyboardVisible = insets.isVisible(WindowInsetsCompat.Type.ime());
  }

  /// Android 11+ / API 30+
  private void handleKeyboardOffsets(WindowInsetsCompat insets) {
    hideSystemUI();

    if (isKeyboardVisible) {
      keyboardHeight = insets.getInsets(WindowInsetsCompat.Type.ime()).bottom;
    } else {
      Insets navBarInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars());
      keyboardHeight = navBarInsets.bottom;
    }
  }

  /// Android 10- / API29-
  private void calcKeyboardVisibilityApi26() {
    Rect r = new Rect();
    rootView.getWindowVisibleDisplayFrame(r);
    int screenHeight = rootView.getHeight();
    int keypadHeight = screenHeight - r.bottom;

    isKeyboardVisible = keypadHeight > screenHeight * 0.2;
  }

  /// All
  private void hideSystemUI() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      final WindowManager.LayoutParams params = getWindow().getAttributes();
      params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_NEVER;
      getWindow().setAttributes(params);
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      WindowInsetsController controller = getWindow().getInsetsController();
      if (controller != null) {
        if (isKeyboardVisible) {
          // Nur Statusleiste ausblenden
          controller.hide(WindowInsets.Type.statusBars());
          controller.show(WindowInsets.Type.navigationBars());
        } else {
          // Beides ausblenden
          controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
          controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        }
      }
    } else {
      int flags = View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;

      if (!isKeyboardVisible) {
        flags |= View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN;
      }

      getWindow().getDecorView().setSystemUiVisibility(flags);
    }
  }
}
