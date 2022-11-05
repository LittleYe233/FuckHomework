import type { Handle, HandleServerError } from '@sveltejs/kit';
import type { Error } from './lib/types';
import { getConsoleFileLogger } from './lib/server/logger';

const logger = getConsoleFileLogger();

export const handle: Handle = async ({ event, resolve }) => {
  const clientAddress = event.getClientAddress();
  const method = event.request.method;
  const url = event.url;
  
  const response = await resolve(event);

  const status = response.status;
  
  logger.http(`${method} ${status} ${url} from ${clientAddress}`);

  return response;
};

export const handleError: HandleServerError = ({ error }) => {
  const err: Error = error as Error;

  logger.warn('Previous panicked response:');
  err.stack.split('\n').forEach(v => logger.warn(`  ${v}`));

  return {
    message: 'Error'
  };
};
