import type { HomeworkMetadata } from './components';

/**
 * `server` section of project configuration.
 *
 * @param host binding host (HTTP)
 * @param port binding port (HTTP)
 * @param strictPort whether to exit if port is already in use, instead of automatically try the next available port
 */
export interface ProjectServerConfig {
  host?: string;
  port?: number;
  strictPort?: boolean;
}

export type AssignmentConfig = HomeworkMetadata;

export interface ProjectConfig {
  version: number;
  server?: ProjectServerConfig;
  assignments?: AssignmentConfig[];
}
