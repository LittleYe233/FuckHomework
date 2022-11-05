import { MAX_LEVEL_LENGTH } from '../logger';
import dayjs from 'dayjs';
import { fileURLToPath } from 'url';
import winston from 'winston';
import consoleLoggerTransport from '../logger';

export const getLogfile = (d?: Date) =>
  fileURLToPath(new URL(`../../../logs/runtime_${dayjs(d).format('YYYYMMDDHHmmssZZ')}.log`, import.meta.url));

export const DEFAULT_LOGFILE_FUNC = () =>
  fileURLToPath(new URL(`../../../logs/runtime_${dayjs().format('YYYYMMDDHHmmssZZ')}.log`, import.meta.url));
/**
 * @note This is (maybe) the first time the constant is created!
 */
export const DEFAULT_LOGFILE_DATE = new Date();

const fileLoggerFormat = winston.format.combine(
  winston.format.splat(),
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}${' '.repeat(MAX_LEVEL_LENGTH - level.length)} ${message}`
  )
);

export const getTransport = (filename?: string | void | (() => string | undefined)) => {
  let _f: string | undefined;

  if (typeof filename === 'function') {
    _f = filename();
  } else {
    _f = filename || getLogfile(DEFAULT_LOGFILE_DATE);
  }

  return new winston.transports.File({
    filename: _f,
    format: fileLoggerFormat,
    level: 'silly'
  });
};

/**
 * @example `/path/to/project/root/logs/runtime_20220123123456789+0100.log`
 */
export default getTransport(getLogfile(DEFAULT_LOGFILE_DATE));

export const getConsoleFileLogger = (filename?: string | (() => string | undefined)) =>
  winston.createLogger({
    transports: [consoleLoggerTransport, getTransport(filename)]
  });
