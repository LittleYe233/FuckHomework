import lodash from 'lodash';
import type {
  AssignmentConfig,
  HomeworkVarSubstitutions,
  ProjectConfig,
  RawProjectConfig,
  StudentInfo,
  StudentVarSubstitutions,
  VarSubstitutions
} from './types';
import _cfg from '~/../config.json';
import { parseRuleLoader } from './rules';

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
    submissionMethod: 'Uploading files',
    rules: []
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
    // try to merge with default values
    const assignment = lodash.merge({}, DEFAULT_ASSIGNMENT_CONFIG[_ver], a);

    // check title
    if (typeof assignment.title === 'undefined') {
      throw ReferenceError('assignment has no title');
    }

    // check dueTime
    if (typeof assignment.dueTime === 'undefined') {
      assignment.dueTime = null;
    } else if (typeof assignment.dueTime === 'string') {
      try {
        assignment.dueTime = new Date(assignment.dueTime);
      } catch (e) {
        throw TypeError('invalid date');
      }
    }

    // check rules
    assignment.rules = assignment.rules.flatMap(rule => {
      try {
        // try to replace rule config with rule loader
        return [parseRuleLoader(rule)];
      } catch {
        // delete the original element if failed
        return [];
      }
    });

    return assignment as AssignmentConfig;
  });

  return cfg;
}

export const cfg = parseProjectConfig();

// for compatibility
function _getVarSubstitutions_h(config: ProjectConfig, hw_id: number): HomeworkVarSubstitutions {
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

function _getVarSubstitutions_s(student: StudentInfo): StudentVarSubstitutions {
  return {
    studentId: student.id.toString(),
    studentName: student.name
  };
}

export function getVarSubstitutions(options: { config?: ProjectConfig; hw_id?: number; student?: StudentInfo }): Partial<VarSubstitutions> {
  let result = {};

  if (typeof options.config !== 'undefined' && typeof options.hw_id !== 'undefined') {
    result = { ...result, ..._getVarSubstitutions_h(options.config, options.hw_id) };
  }
  if (typeof options.student !== 'undefined') {
    result = { ...result, ..._getVarSubstitutions_s(options.student) };
  }

  return result;
}

/**
 * Parse variables in the given string.
 *
 * @example
 * parseVars("${homeworkTitle}/foo/bar", { config, hw_id: 1 }) === "Title_of_Homework_with_ID_1/foo/bar"
 *
 * @param str the string to be variable-parsed
 * @param options.config project config
 * @param options.hw_id homework ID
 * @param options.student student info
 */
export function parseVars(str: string, options: { config?: ProjectConfig; hw_id?: number; student?: StudentInfo }): string {
  const varsubs = getVarSubstitutions(options);
  const re = new RegExp(
    Object.keys(varsubs)
      .map((v) => '\\${' + v + '}')
      .join('|'),
    'g'
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const varsubsFiltered = Object.fromEntries(Object.entries(varsubs).filter(([_, v]) => v != null)) as Record<string, string>;
  return str.replace(re, (matched) => varsubsFiltered[matched.slice(2, matched.length - 1)]);
}
