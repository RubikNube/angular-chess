export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
};

export default class LoggingUtils {

  public static log(logLevel: LogLevel, message: string): void {
    switch (logLevel) {
      case LogLevel.DEBUG:
        console.debug(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
        console.error(message);
        break;
      default:
        console.info(message);
    }
  }
}