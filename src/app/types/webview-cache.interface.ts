/// Interface zur Definition der WebViewCache-Funktionalität
/// TS equivalent zur WebViewCacheBridge in der App
export interface WebViewCacheInterface {
  clearCache(): void;
}

/// Erweiterung des globalen Window-Interfaces
/// Hiermit kann typsicher clearCache() aufgerufen werden.
/// siehe <src/app/services/webviewcache.service.ts>
declare global {
  interface Window {
    WebViewCache: WebViewCacheInterface;
  }
}
