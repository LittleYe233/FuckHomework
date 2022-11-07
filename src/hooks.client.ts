import type { HandleClientError } from '@sveltejs/kit';
import type { Error } from './lib/types';
import { getConsoleLogger } from './lib/logger';

const logger = getConsoleLogger();

export const handleError: HandleClientError = ({ error, event }) => {
  const err: Error = error as Error;

  logger.warn(`Previous panicked client error at ${event.url}:`);
  err.stack.split('\n').forEach(v => logger.warn(`  ${v}`));

  return {
    message: 'Error'
  };
};
