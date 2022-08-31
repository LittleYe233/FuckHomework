<script lang="ts">
  import { cfg } from '~/lib/config';
  import type { FilenameCheckAssignmentRuleLoader } from '~/lib/rules';
  import type { AssignmentConfig } from '~/lib/types';

  export let rule: FilenameCheckAssignmentRuleLoader;
  export let hw_id: number = -1;

  let hw: AssignmentConfig | undefined;
  if (hw_id !== -1) {
    hw = cfg.homework.entries[hw_id];
  }

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
      console.debug(`Filename pattern duplicates with others. Rule: ${rule}. Pattern: ${p}.`);
    } else {
      renderedPatterns.push(p);
    }
  });
</script>

<div class="inline-grid">
  <p>
    Names of all files should {#if rule.priority === 'whitelist'}<span class="font-bold">be one of</span>{:else}<span>not be any of</span
      >{/if} the following patterns:
  </p>
  <ul class="list-inside list-disc">
    {#each renderedPatterns as p}
      <li>
        {@html p}
      </li>
    {/each}
  </ul>
</div>
