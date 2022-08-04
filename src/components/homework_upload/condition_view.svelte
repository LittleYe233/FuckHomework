<script lang="ts">
  import type { AssignmentRuleLoaders } from '~/lib/types';

  export let rules: AssignmentRuleLoaders;
</script>

<!-- conditions -->
<ul class="mx-4 my-4 list-inside list-disc">
  {#each rules as rule}
    <li><code class="break-all">{rule.toString()}</code></li>
  {/each}
</ul>
