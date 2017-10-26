export namespace JsonUtil {

  export function isEmptyObject(obj: any): boolean {
    return obj == null || Object.keys(obj).length === 0;
  }
}
