/**
 * This is a transportation from winston.
 * 
 * @see https://github.com/winstonjs/winston/blob/a584db39359312058cb639c7bde024f87e6155ce/lib/winston/transports/console.js
 */

import TransportStream from 'winston-transport';
import { LEVEL, MESSAGE } from 'triple-beam';
import type { ConsoleTransportOptions } from 'winston/lib/winston/transports';

interface _ConsoleTransportOptions extends ConsoleTransportOptions {
  name?: string;
  stderrLevels?: string[];
  consoleWarnLevels?: string[];
}

export default class extends TransportStream {
  name: string;
  stderrLevels: Record<string, true>;
  consoleWarnLevels: Record<string, true>;

  constructor(options: _ConsoleTransportOptions = {}) {
    super(options as ConsoleTransportOptions);

    this.name = options.name || 'console';
    this.stderrLevels = this._stringArrayToSet(options.stderrLevels);
    this.consoleWarnLevels = this._stringArrayToSet(options.consoleWarnLevels);

    this.setMaxListeners(30);
  }

  log(info: { [x: symbol]: string }, callback: () => void) {
    /** @note May be still buggy, */
    this.emit('logged', info);

    if (this.stderrLevels[info[LEVEL]]) {
      console.error(info[MESSAGE]);

      if (callback) {
        callback();
      }
      return;
    } else if (this.consoleWarnLevels[info[LEVEL]]) {
      console.warn(info[MESSAGE]);

      if (callback) {
        callback();
      }
      return;
    }

    console.log(info[MESSAGE]);

    if (callback) {
      callback();
    }
  }

  _stringArrayToSet(strArray?: string[], errMsg?: string | undefined): Record<string, true> {
    if (!strArray) return {};

    errMsg = errMsg || 'Cannot make set from type other than Array of string elements';

    if (!Array.isArray(strArray)) {
      throw new Error(errMsg);
    }

    return strArray.reduce((set, el) => {
      if (typeof el !== 'string') {
        throw new Error(errMsg);
      }
      set[el] = true;

      return set;
    }, {} as Record<string, true>);
  }
}
