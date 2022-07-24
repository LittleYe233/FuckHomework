import lodash from 'lodash';
import type { AssignmentConfig, ProjectConfig, RawProjectConfig, VarSubstitutions } from './types';
import _cfg from '~/../config.json';

/** @note Key is string-type of the version number. */
export const DEFAULT_CONFIG: Record<string, ProjectConfig> = {
  1: {
    version: 1,
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: false
    },
    homework: {
      savePath: './data/homework',
      subFolderFormat: '${homeworkTitle}',
      entries: []
    }
  }
};
export const DEFAULT_ASSIGNMENT_CONFIG: Record<string, Omit<AssignmentConfig, 'title'>> = {
  1: {
    content: '',
    semester: '',
    subject: '',
    chapter: '',
    dueTime: null,
    submissionMethod: 'Uploading files'
  }
};

/**
 * Parse `Date` instance to formatted datetime string.
 * @param dt a `Date` instance or null
 * @note The locale is forced to zh-CN and the time zone Asia/Shanghai now.
 * @note Return an empty string if passed null.
 */
export function parseDateTime(dt: Date | null): string {
  if (dt === null) {
    return '';
  }
  return dt.toLocaleString('zh-CN', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'Asia/Shanghai'
  });
}

export const original_cfg: RawProjectConfig = _cfg;

export function parseProjectConfig(): ProjectConfig {
  const _ver = original_cfg.version.toString();
  if (!Object.keys(DEFAULT_CONFIG).includes(_ver)) {
    throw TypeError(`invalid version number: ${_ver}`);
  }
  const cfg: ProjectConfig = lodash.merge({}, DEFAULT_CONFIG[_ver], original_cfg);
  cfg.homework.entries = cfg.homework.entries.map((a) => {
    const assignment = lodash.merge({}, DEFAULT_ASSIGNMENT_CONFIG[_ver], a);
    if (typeof assignment.title === 'undefined') {
      throw ReferenceError('assignment has no title');
    }
    if (typeof assignment.dueTime === 'undefined') {
      assignment.dueTime = null;
    } else if (typeof assignment.dueTime === 'string') {
      try {
        assignment.dueTime = new Date(assignment.dueTime);
      } catch (e) {
        throw TypeError('invalid date');
      }
    }
    // just declare its type
    const _a: AssignmentConfig = assignment;
    return _a;
  });

  return cfg;
}

export const cfg = parseProjectConfig();

export function getVarSubstitutions(config: ProjectConfig, hw_id: number): VarSubstitutions {
  const et = config.homework.entries[hw_id];
  return {
    homeworkTitle: et.title,
    homeworkSemester: et.semester,
    homeworkSubject: et.subject,
    homeworkChapter: et.chapter,
    homeworkDueTime: parseDateTime(et.dueTime),
    homeworkSubmissionMethod: et.submissionMethod
  };
}

/**
 * Parse variables in the given string.
 *
 * @example
 * parseVars("${homeworkTitle}/foo/bar", config, 1) === "Title_of_Homework_with_ID_1/foo/bar"
 *
 * @param str the string to be variable-parsed
 * @param config project config
 * @param hw_id homework ID
 */
export function parseVars(str: string, config: ProjectConfig, hw_id: number): string {
  const varsubs = getVarSubstitutions(config, hw_id);
  const re = new RegExp(
    Object.keys(varsubs)
      .map((v) => '\\${' + v + '}')
      .join('|'),
    'g'
  );
  return str.replace(re, (matched) => varsubs[matched.slice(2, matched.length - 1)]);
}
