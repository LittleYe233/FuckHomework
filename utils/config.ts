import * as yaml from 'yaml';
import * as path from 'path';
import * as fs from 'fs/promises';
import lodash from 'lodash';
import type { AssignmentConfig, ProjectConfig } from '../src/lib/types';

export const DEFAULT_CONFIG_PATH = path.resolve(__dirname, '../config.yml');

/** @note Key is string-type of the version number. */
export const DEFAULT_CONFIG: Record<string, ProjectConfig> = {
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
export const DEFAULT_ASSIGNMENT_CONFIG: Record<string, Partial<AssignmentConfig>> = {
  1: {
    content: '',
    semester: '',
    subject: '',
    chapter: '',
    dueTime: null,
    submissionMethod: 'Uploading files'
  }
};

export async function parseConfig(path: string): Promise<Required<ProjectConfig>> {
  return fs.readFile(path, { encoding: 'utf-8' }).then((data) => {
    let original_cfg, _ver: string;
    try {
      original_cfg = yaml.parse(data);
      _ver = original_cfg.version.toString();
    } catch (e) {
      return Promise.reject(e);
    }
    if (!Object.keys(DEFAULT_CONFIG).includes(_ver)) {
      return Promise.reject(`invalid version number: ${_ver}`);
    }
    const cfg: Required<ProjectConfig> = lodash.merge({}, DEFAULT_CONFIG[_ver], original_cfg);
    cfg.assignments = cfg.assignments.map(a => lodash.merge({}, DEFAULT_ASSIGNMENT_CONFIG[_ver], a));
    return Promise.resolve(cfg);
  });
}

export async function parseProjectConfig(): Promise<Required<ProjectConfig>> {
  return parseConfig(DEFAULT_CONFIG_PATH);
}
