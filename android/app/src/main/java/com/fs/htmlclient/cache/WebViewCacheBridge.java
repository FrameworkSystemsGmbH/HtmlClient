package com.fs.htmlclient.cache;

import android.app.Activity;
import android.content.Context;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

/// Die {@link WebViewCacheBridge} kümmert sich um die Bereinigung des Caches der WebView.
///
/// Sie ist Teil der Integration des [webview-cache-plugins](https://github.com/FrameworkSystemsGmbH/capacitor-plugin-webview-cache).
public record WebViewCacheBridge(Context context, WebView webView) {

  /// Magic Verknüpfung der Java und TypeScript clearCache Funktion.
  ///
  /// Wird im WebViewCacheService (webviewcache.service.ts) aufgerufen.
  @JavascriptInterface
  public void clearCache() {
    if (context instanceof Activity activity) {
      activity.runOnUiThread(() -> webView.clearCache(true));
    }
  }
}
