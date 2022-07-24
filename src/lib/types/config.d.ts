import type { HomeworkMetadata, RawHomeworkMetadata } from './components';
import { DeepRequired } from 'utility-types';

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

export type AssignmentConfig = HomeworkMetadata;
export type RawAssignmentConfig = RawHomeworkMetadata;

export interface RawHomeworkConfig {
  savePath?: string,
  subFolderFormat?: string,
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

export interface VarSubstitutions extends Record<string, string> {
  homeworkTitle: string,
  /** @note We don't use `content` field because it may be too long. */
  homeworkSemester: string,
  homeworkSubject: string,
  homeworkChapter: string,
  homeworkDueTime: string,
  homeworkSubmissionMethod: string
}
