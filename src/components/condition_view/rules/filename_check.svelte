<script lang="ts">
  import { cfg } from '$lib/config';
  import { getConsoleLogger } from '~/lib/logger';
  import type { FilenameCheckAssignmentRuleLoader } from '$lib/rules';
  import type { AssignmentConfig } from '$lib/types';

  export let rule: FilenameCheckAssignmentRuleLoader;
  export let hw_id: number = -1;
  export const lang: string = '';

  let hw: AssignmentConfig | undefined;
  if (hw_id !== -1) {
    hw = cfg.homework.entries[hw_id];
  }

  const logger = getConsoleLogger();

  const renderedPatterns: String[] = [];
  (rule.priority === 'whitelist' ? rule.whitelist : rule.blacklist).forEach((li) => {
    let p;
    if (hw === undefined) {
      p = rule.renderPatternForViewing(li);
    } else {
      p = rule.renderPatternForViewing(li, {
        homework: hw,
        varsubs: {
          homeworkTitle: hw.title,
          homeworkSemester: hw.semester,
          homeworkSubject: hw.subject,
          homeworkChapter: hw.chapter,
          studentId: '',
          studentName: ''
        }
      });
    }
    if (renderedPatterns.includes(p)) {
      logger.verbose(`Filename pattern duplicates with others. Rule: ${rule}. Pattern: ${p}.`);
      // console.debug(`Filename pattern duplicates with others. Rule: ${rule}. Pattern: ${p}.`);
    } else {
      renderedPatterns.push(p);
    }
  });

  // fallback to the default language
  import type { TFunction } from 'i18next';
  
  export let __: TFunction;
</script>

<div class="inline-grid">
  <p>
    {__('filename_check:normal.names_of_all_files')} {#if rule.priority === 'whitelist'}<span class="font-bold">{__('filename_check:normal.one_of')}</span>{:else}<span>{__('filename_check:normal.not_any_of')}</span
      >{/if} {__('filename_check:normal.following_patterns')}
  </p>
  <ul class="list-inside list-disc">
    {#each renderedPatterns as p}
      <li>
        {@html p}
      </li>
    {/each}
  </ul>
</div>
