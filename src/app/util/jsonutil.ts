export class JsonUtil {

  public static isEmptyObject(obj: any): boolean {
    for (let key in obj) {
      return false;
    }

    return true;
  }

}
