export class JsonUtil {

  public static isEmptyObject(obj: any): boolean {
    return obj == null || Object.keys(obj).length === 0;
  }

}
