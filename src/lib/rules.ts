import { parseVars, STUDENT_VAR_SUB_FIELD_READABLE_ITALIC, VAR_SUB_FIELD_READABLE_ITALIC } from './config';
import type {
  AssignmentRuleLoader,
  FilenameCheckAssignmentRule,
  FileUploadData,
  ParseVarsOptions,
  RawAssignmentRule,
  ValidationResult,
  VarSubstitutions,
  _AssignmentRuleLoader,
  WhiteOrBlacklistItem
} from './types';

export const DEFAULT_WHITE_OR_BLACKLIST_COMPOUND = {
  displayHTML: ''
};

export class FilenameCheckAssignmentRuleLoader implements _AssignmentRuleLoader, FilenameCheckAssignmentRule {
  type: 'filename_check';
  priority: 'whitelist' | 'blacklist';
  whitelist: WhiteOrBlacklistItem[];
  blacklist: WhiteOrBlacklistItem[];

  constructor(rule: FilenameCheckAssignmentRule) {
    if (rule.type !== 'filename_check') {
      throw TypeError('invalid type name of rule: ' + rule.type);
    }

    this.type = 'filename_check';
    this.priority = rule.priority || 'blacklist';
    this.whitelist = (rule.whitelist || []).map(v => {
      if (typeof v === 'object' && !(v instanceof RegExp)) {
        // merge default values
        return { ...DEFAULT_WHITE_OR_BLACKLIST_COMPOUND, ...v };
      } else {
        return v;
      }
    });
    this.blacklist = rule.blacklist || [];
  }

  /**
   * Validates if a `FileUploadData` is valid for this rule.
   */
  validate(src: FileUploadData, options: ParseVarsOptions): ValidationResult {
    // check function
    const _check = (s: WhiteOrBlacklistItem): boolean => {
      if (typeof s === 'string') {
        const parsed = parseVars(s, options);
        return parsed === src.name;
      } else if (s instanceof RegExp) {
        return s.test(src.name);
      } else {
        // `.displayHTML` doesn't affect validation.
        return _check(s.object);
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
        entries: ['whitelist', r || false],
        message: 'Filename does not meet any of valid patterns'
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
        entries: ['blacklist', r || true],
        message: 'Filename meets certain invalid pattern'
      };
    }
  }

  /**
   * Returns a string representation of this rule without methods.
   */
  toString(): string {
    return JSON.stringify({
      type: this.type,
      priority: this.priority,
      whitelist: this.whitelist,
      blacklist: this.blacklist
    });
  }

  /**
   * Renders an given pattern string to an HTML string for rule viewing (a.k.a. other Svelte components).
   *
   * Note that we don't accept `student` property for `options`.
   */
  renderPatternForViewing(pattern: WhiteOrBlacklistItem): string;
  renderPatternForViewing(pattern: WhiteOrBlacklistItem, options: Omit<ParseVarsOptions, 'student'>): string;
  renderPatternForViewing(pattern: WhiteOrBlacklistItem, options?: Omit<ParseVarsOptions, 'student'>): string {
    if (typeof pattern === 'string') {
      if (options === undefined) {
        return parseVars(pattern, { varsubs: VAR_SUB_FIELD_READABLE_ITALIC });
      } else {
        return parseVars(pattern, {
          ...options,
          varsubs: { ...options.varsubs, ...STUDENT_VAR_SUB_FIELD_READABLE_ITALIC } as VarSubstitutions
        });
      }
    } else if (pattern instanceof RegExp) {
      return `RegExp: <code>${pattern.toString().slice(1, -1)}</code>`;
    } else if (typeof pattern.object !== 'undefined') {
      return (
        pattern?.displayHTML ??
        (options === undefined ? this.renderPatternForViewing(pattern.object) : this.renderPatternForViewing(pattern.object, options))
      );
    } else {
      throw TypeError('invalid pattern type');
    }
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
