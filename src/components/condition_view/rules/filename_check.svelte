<script lang="ts">
  import type { FilenameCheckAssignmentRuleLoader } from '~/lib/rules';

  export let rule: FilenameCheckAssignmentRuleLoader;
</script>

<div class="inline-grid">
  <p>
    Names of all files should {#if rule.priority === 'whitelist'}<span class="font-bold">be one of</span>{:else}<span>not be any of</span
      >{/if} the following patterns:
  </p>
  <ul class="list-inside list-disc">
    {#each rule.priority === 'whitelist' ? rule.whitelist : rule.blacklist as li}
      <li>
        {@html rule.renderPatternForViewing(li)}
      </li>
    {/each}
  </ul>
</div>
