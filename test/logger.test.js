import winston from 'winston';
import chalk from 'chalk';

const COLORS = {
  trace: chalk.magenta,
  debug: chalk.magenta,
  verbose: chalk.blue,
  info: chalk.green,
  warn: chalk.yellow.bold,
  error: chalk.bgRed.bold,
  timestamp: chalk.grey
};

const MAX_LEVEL_LENGTH = 7;

const consoleLoggerFormat = winston.format.combine(
  winston.format.splat(),
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp }) => `${COLORS.timestamp('[' + timestamp + ']')} ${COLORS[level](level.toUpperCase())}${' '.repeat(MAX_LEVEL_LENGTH - level.length)} ${message}`)
);
const fileLoggerFormat = winston.format.combine(
  winston.format.splat(),
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}${' '.repeat(MAX_LEVEL_LENGTH - level.length)} ${message}`)
);

const logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console({
      format: consoleLoggerFormat
    }),
    new winston.transports.File({
      filename: 'test.log',
      format: fileLoggerFormat
    })
  ]
});

logger.error('%s', 'Error!');
logger.warn('%s', 'Warn!');
logger.info('%s', 'Info!');
logger.verbose('%s', 'Verbose!');
logger.debug('%s', 'Debug!');
