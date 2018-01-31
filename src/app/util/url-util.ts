export namespace UrlUtil {

  export function urlDecode(str: string): string {
    return str ? decodeURIComponent(str.replace(/\+/g, ' ')) : str;
  }

  export function encodeQueryData(data: any): string {
    return Object.keys(data).map(key => {
      return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');
  }
}
