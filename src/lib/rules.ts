import { parseVars } from './config';
import type {
  AssignmentRuleLoader,
  FilenameCheckAssignmentRule,
  FileUploadData,
  ProjectConfig,
  RawAssignmentRule,
  StudentInfo,
  ValidationResult,
  _AssignmentRuleLoader
} from './types';

export class FilenameCheckAssignmentRuleLoader implements _AssignmentRuleLoader, FilenameCheckAssignmentRule {
  type: 'filename_check';
  priority: 'whitelist' | 'blacklist';
  whitelist: string[];
  blacklist: string[];

  constructor(rule: FilenameCheckAssignmentRule) {
    if (rule.type !== 'filename_check') {
      throw TypeError('invalid type name of rule: ' + rule.type);
    }

    this.type = 'filename_check';
    this.priority = rule.priority || 'whitelist';
    this.whitelist = rule.whitelist || [];
    this.blacklist = rule.blacklist || [];
  }

  validate(src: FileUploadData, config: ProjectConfig, hw_id: number, student: StudentInfo): ValidationResult {
    // check function
    const _check = (s: string) => {
      const parsed = parseVars(s, { config, hw_id, student });
      if (parsed === src.name) {
        return true;
      }
    };

    // check whitelist
    const _check_w = () => {
      return this.whitelist.find(_check);
    };

    // check blacklist
    const _check_b = () => {
      return this.blacklist.find(_check);
    };

    // finally validate
    if (this.priority === 'whitelist') {
      const r = _check_w();
      return {
        valid: typeof r !== 'undefined',
        /**
         * @note The second element can be only:
         * - `r`, when found an entry in whitelist (passed);
         * - `false`, when not found or whitelist is empty (failed).
         */
        entries: ['whitelist', r || false]
      };
    } else {
      const r = _check_b();
      return {
        valid: typeof r === 'undefined',
        /**
         * @note The second element can be only:
         * - `r`, when found an entry in blacklist (failed);
         * - `true`, when not found or blacklist is empty (passed).
         */
        entries: ['blacklist', r || true]
      };
    }
  }

  toString(): string {
    return JSON.stringify({
      type: this.type,
      priority: this.priority,
      whitelist: this.whitelist,
      blacklist: this.blacklist
    });
  }
}

/**
 * Parse rule configuration to corresponding rule loader.
 * @param rule rule config
 */
export function parseRuleLoader(rule: RawAssignmentRule): AssignmentRuleLoader {
  switch (rule.type) {
  case 'filename_check':
    return new FilenameCheckAssignmentRuleLoader(rule as FilenameCheckAssignmentRule);
  default:
    throw TypeError('invalid rule');
  }
}