package com.fs.htmlclient;

import android.graphics.Rect;
import android.os.Bundle;
import android.view.View;
import android.widget.FrameLayout;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {

  private View view;
  private int viewRenderHeight;
  private FrameLayout.LayoutParams frameLayoutParams;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // add(Plugin.class);
    }});

    this.clearCache();
    this.hideSystemUI();
    this.attachSizeObserver();
  }

  private void clearCache() {
    this.getBridge().getWebView().clearCache(true);
  }

  private void hideSystemUI() {
    View decorView = getWindow().getDecorView();
    decorView.setSystemUiVisibility(
      View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        | View.SYSTEM_UI_FLAG_FULLSCREEN);
  }

  private void attachSizeObserver() {
    FrameLayout content = (FrameLayout) this.findViewById(android.R.id.content);
    view = content.getChildAt(0);
    view.getViewTreeObserver().addOnGlobalLayoutListener(this::contentSizeChanged);
    frameLayoutParams = (FrameLayout.LayoutParams) view.getLayoutParams();
  }

  private void contentSizeChanged() {
    int usableHeightNow = computeUsableHeight();

    if (usableHeightNow != viewRenderHeight) {
      int usableHeightSansKeyboard = view.getRootView().getHeight();
      int heightDifference = usableHeightSansKeyboard - usableHeightNow;

      if (heightDifference > (usableHeightSansKeyboard / 4)) {
        // keyboard probably just became visible
        frameLayoutParams.height = usableHeightSansKeyboard - heightDifference;
      } else {
        // keyboard probably just became hidden
        frameLayoutParams.height = usableHeightSansKeyboard;
        // status bar and navigation bar don't hide themselves after keyboard was closed
        this.hideSystemUI();
      }

      view.requestLayout();
      viewRenderHeight = usableHeightNow;
    }
  }

  private int computeUsableHeight() {
    Rect r = new Rect();
    view.getWindowVisibleDisplayFrame(r);
    return (r.bottom - r.top);
  }
}
