import { RawAssignmentConfig, AssignmentConfig } from './config';

export type RawHomeworkMetadata = RawAssignmentConfig;
export type HomeworkMetadata = AssignmentConfig;

export interface FileUploadData {
  type: string;
  size: number;
  name: string;
  // text: string,
  text64: string; // Base64-encoded string, representing raw content of the file
}

export { AssignmentRule } from './rules';

export interface StudentInfo {
  id: number;
  name: string;
}

export interface InfoSlot {
  homework?: AssignmentConfig;
  student?: StudentInfo
}
