/**
 * Homework metadata passed to `HomeworkSlot` svelte component.
 * @param title homework title
 * @param content homework content (shown in detail page) (default: "")
 * @param semester corresponding semester
 * @param subject homework subject
 * @param chapter corresponding chapter
 * @param dueTime due time of homework
 * @param submissionMethod method to submit homework (default: "Uploading files")
 */
export interface HomeworkMetadata {
  title: string;
  content?: string;
  semester?: string;
  subject?: string;
  chapter?: string;
  dueTime?: Date;
  submissionMethod?: string;
}