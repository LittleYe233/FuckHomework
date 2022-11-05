import { COLORS, MAX_LEVEL_LENGTH } from './common';

import Console from './console';
import type { LEVEL } from './common';
import winston from 'winston';

const consoleLoggerFormat = winston.format.combine(
  winston.format.splat(),
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, timestamp }) =>
      `${COLORS.timestamp('[' + timestamp + ']')} ${COLORS[level as LEVEL](level.toUpperCase())}${' '.repeat(
        MAX_LEVEL_LENGTH - level.length
      )} ${message}`
  )
);

/**
 * @note Please please note that some logs may output to the browser rather than
 * the console on the server when using this logger!
 */
const consoleLoggerTransport = new Console({
  format: consoleLoggerFormat,
  level: 'silly'
});
export default consoleLoggerTransport;

export const getConsoleLogger = () =>
  winston.createLogger({
    transports: [consoleLoggerTransport]
  });
