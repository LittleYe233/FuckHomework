import type { Handle } from '@sveltejs/kit';
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
