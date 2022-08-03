export interface Rule {
  type: string;
}

export interface _AssignmentRule extends Rule {
  type: string;
  priority: 'whitelist' | 'blacklist';
  whitelist: string[];
  blacklist: string[];
}

export interface FilenameCheckAssignmentRule extends _AssignmentRule {
  type: 'filename_check';
}

// `RuleA | RuleB | RuleC ...`
export type AssignmentRule = FilenameCheckAssignmentRule;
export type AssignmentRules = AssignmentRule[];
