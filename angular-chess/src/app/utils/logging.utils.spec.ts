import LoggingUtils, { LogLevel } from "./logging.utils";

describe('LoggingUtils', () => {

  let timesOfLogging: number = 0;

  function dummyFunction(arg0: string): string {
    timesOfLogging++;
    return arg0;
  }

  beforeEach(() => {
    timesOfLogging = 0;
    LoggingUtils.activateLogging = false;
  });

  it('should not evaluate parameter before logging', () => {
    LoggingUtils.log(LogLevel.DEBUG, () => dummyFunction("This should not be logged"));
    expect(timesOfLogging).toBe(0);
  });

  it('should evaluate parameter when logging is activated', () => {
    LoggingUtils.activateLogging = true;
    LoggingUtils.log(LogLevel.DEBUG, () => dummyFunction("This should not be logged"));
    expect(timesOfLogging).toBe(1);
  });
});

