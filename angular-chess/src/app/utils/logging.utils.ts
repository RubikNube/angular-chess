export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
};

export default class LoggingUtils {
  public static activateLogging = false;

  public static log(logLevel: LogLevel, message: () => string): void {
    if (!this.activateLogging) {
      return;
    }
    switch (logLevel) {
      case LogLevel.DEBUG:
        console.debug(message.call(null));
        break;
      case LogLevel.INFO:
        console.info(message.call(null));
        break;
      case LogLevel.WARN:
        console.warn(message.call(null));
        break;
      case LogLevel.ERROR:
        console.error(message.call(null));
        break;
      default:
        console.info(message.call(null));
    }
  }
}