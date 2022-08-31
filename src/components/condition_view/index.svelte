<script lang="ts">
  import type { AssignmentRuleLoaders } from '~/lib/types';
  import FilenameCheck from './rules/filename_check.svelte';

  export let rules: AssignmentRuleLoaders;
  export let hw_id: number = -1;

  const comps = {
    filename_check: FilenameCheck
  };
</script>

<!-- conditions -->
<ul class="mx-4 my-4 list-inside list-disc">
  {#each rules as rule}
    <li class="break-all">
      <svelte:component this={comps[rule.type]} {rule} hw_id={hw_id} />
    </li>
  {/each}
</ul>
