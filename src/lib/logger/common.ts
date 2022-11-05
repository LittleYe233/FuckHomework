import chalk from 'chalk';

export type LEVEL = 'trace' | 'debug' | 'verbose' | 'info' | 'warn' | 'error';

export const MAX_LEVEL_LENGTH = 7;

export const COLORS = {
  trace: chalk.magenta,
  debug: chalk.magenta,
  verbose: chalk.blue,
  info: chalk.green,
  warn: chalk.yellow.bold,
  error: chalk.bgRed.bold,
  timestamp: chalk.grey
};
