import { DeepRequired } from 'utility-types';

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
export interface RawHomeworkMetadata {
  title: string;
  content?: string;
  semester?: string;
  subject?: string;
  chapter?: string;
  dueTime?: string | null;
  submissionMethod?: string;
}
export interface HomeworkMetadata extends DeepRequired<RawHomeworkMetadata> {
  // JSON doesn't directly support `Date` object.
  dueTime: Date | null;
};
