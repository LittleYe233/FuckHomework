import { DeepRequired } from 'utility-types';
import type { AssignmentRules } from './rules';

/**
 * `server` section of project configuration.
 *
 * @param host binding host (HTTP)
 * @param port binding port (HTTP)
 * @param strictPort whether to exit if port is already in use, instead of automatically try the next available port
 */
export interface RawProjectServerConfig {
  host?: string;
  port?: number;
  strictPort?: boolean;
}
export type ProjectServerConfig = DeepRequired<RawProjectServerConfig>;

/**
 * Homework metadata passed to `HomeworkSlot` svelte component.
 *
 * @param title homework title
 * @param content homework content (shown in detail page)
 * @param semester corresponding semester
 * @param subject homework subject
 * @param chapter corresponding chapter
 * @param dueTime due time of homework (null: no due time)
 * @param submissionMethod method to submit homework
 */
export interface RawAssignmentConfig {
  title: string;
  content?: string;
  semester?: string;
  subject?: string;
  chapter?: string;
  dueTime?: string | null;
  submissionMethod?: string;
  rules?: AssignmentRules;
}
export interface AssignmentConfig extends DeepRequired<RawAssignmentConfig> {
  // JSON doesn't directly support `Date` object.
  dueTime: Date | null;
}

export interface RawHomeworkConfig {
  savePath?: string;
  subFolderFormat?: string;
  entries?: RawAssignmentConfig[];
}
export interface HomeworkConfig extends DeepRequired<RawHomeworkConfig> {
  entries: AssignmentConfig[];
}

export interface RawProjectConfig {
  version: number;
  server?: RawProjectServerConfig;
  homework?: RawHomeworkConfig;
}
export interface ProjectConfig extends DeepRequired<RawProjectConfig> {
  homework: HomeworkConfig;
}

export interface HomeworkVarSubstitutions extends Record<string, string> {
  // `hw_id` required
  homeworkTitle: string;
  /** @note We don't use `content` field because it may be too long. */
  homeworkSemester: string;
  homeworkSubject: string;
  homeworkChapter: string;
  homeworkDueTime: string;
  homeworkSubmissionMethod: string;
}

export interface StudentVarSubstitutions extends Record<string, string> {
  // `StudentInfo` required
  studentId: string;
  studentName: string;
}

export interface VarSubstitutions extends HomeworkVarSubstitutions, StudentVarSubstitutions, Record<string, string> {}
