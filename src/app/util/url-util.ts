export class UrlUtil {

  public static encodeQueryData(data: any): string {
    return Object.keys(data).map(key => {
      return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');
  }

}