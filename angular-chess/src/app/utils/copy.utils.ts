export default class CopyUtils {
  public static deepCopyElement(element: any): any {
    return JSON.parse(JSON.stringify(element));
  }
}