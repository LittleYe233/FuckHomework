<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
  const { __, lang } = data;

  import HomeworkSlot from '~/components/homework_slot.svelte';
  import { cfg } from '$lib/config';

  const homeworkSlots = cfg.homework.entries;
</script>

<div class="relative flex min-h-screen flex-col overflow-hidden bg-gray-100 px-8 py-6 font-serif sm:py-6">
  <h1 class="my-4 text-center text-3xl font-bold">{__('heading.homework.submission')}</h1>
  <div>
    <h2 class="mb-4 text-2xl font-bold">{__('heading.homework.list')}</h2>
    <!-- Homework list container -->
    <div>
      {#each homeworkSlots as slot, index}
        <HomeworkSlot metadata={slot} linkable={true} hw_id={index.toString()} {lang} {__} />
      {/each}
    </div>
  </div>
</div>
