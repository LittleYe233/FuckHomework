import lodash from 'lodash';
import type { AssignmentConfig, ProjectConfig, RawProjectConfig } from './types';
import _cfg from '~/../config.json';

/** @note Key is string-type of the version number. */
export const DEFAULT_CONFIG: Record<string, Required<ProjectConfig>> = {
  1: {
    version: 1,
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: false
    },
    assignments: []
  }
};
export const DEFAULT_ASSIGNMENT_CONFIG: Record<string, Omit<Required<AssignmentConfig>, 'title'>> = {
  1: {
    content: '',
    semester: '',
    subject: '',
    chapter: '',
    dueTime: null,
    submissionMethod: 'Uploading files'
  }
};

export const original_cfg: RawProjectConfig = _cfg;

export function parseProjectConfig(): Required<ProjectConfig> {
  const _ver = original_cfg.version.toString();
  if (!Object.keys(DEFAULT_CONFIG).includes(_ver)) {
    throw TypeError(`invalid version number: ${_ver}`);
  }
  const cfg: Required<ProjectConfig> = lodash.merge({}, DEFAULT_CONFIG[_ver], original_cfg);
  cfg.assignments = cfg.assignments.map(a => {
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
    const _a: Required<AssignmentConfig> = assignment;
    return _a;
  });
  
  return cfg;
}

export const cfg = parseProjectConfig();
