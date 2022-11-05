import { cfg } from '../config';
import { getConsoleFileLogger } from './logger';

const logger = getConsoleFileLogger();

const cfgString = JSON.stringify(cfg, undefined, 4);

logger.verbose('Project configuration:');
cfgString.split('\n').forEach(v => logger.verbose(v));

export default cfg;
