import { FilenameCheckAssignmentRuleLoader } from '../rules';
import type { ParseVarsOptions } from './config';

export interface Rule {
  type: string;
}

export interface _AssignmentRule extends Rule {
  priority: 'whitelist' | 'blacklist';
  whitelist: (string | RegExp)[];
  blacklist: (string | RegExp)[];
}

export interface FilenameCheckAssignmentRule extends _AssignmentRule {
  type: 'filename_check';
}

export interface RawAssignmentRule extends Partial<_AssignmentRule>, Rule {
  priority?: string;
}
export type RawAssignmentRules = RawAssignmentRule[];
// `RuleA | RuleB | RuleC ...`
export type AssignmentRule = FilenameCheckAssignmentRule;
export type AssignmentRules = AssignmentRule[];

export interface RuleLoader extends Rule {
  validate(..._: never[]): ValidationResult;
  toString(): string;
}

export interface _AssignmentRuleLoader extends RuleLoader, _AssignmentRule {
  validate(src: FileUploadData, options: ParseVarsOptions): ValidationResult;
  renderPatternForViewing(pattern: string): string;
  renderPatternForViewing(pattern: string, options?: Omit<ParseVarsOptions, 'student'>): string;
}

export type AssignmentRuleLoader = FilenameCheckAssignmentRuleLoader;
export type AssignmentRuleLoaders = AssignmentRuleLoader[];

/**
 * Result of `validate()`.
 *
 * @param valid whether this validation is valid or not
 * @param message optional message, often for human-friendly hints
 * @param entries optional entries, often for code-like returns
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
  entries?: unknown[];
}
