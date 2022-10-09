<script lang="ts">
  import HomeworkSlot from '~/components/homework_slot.svelte';
  import HomeworkUpload from '~/components/homework_upload/index.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  export let { __, hw_id, metadata } = data;
</script>

<div class="relative flex min-h-screen flex-col overflow-hidden bg-gray-100 px-8 py-6 font-serif sm:py-6">
  <h1 class="my-4 text-center text-3xl font-bold">{__('heading.homework.submission')}</h1>
  <a href="/" class="text-sky-400 underline hover:text-sky-600 w-fit">{__('control.homepage')}</a>
  <div>
    <h2 class="mb-4 text-2xl font-bold">{__('heading.homework.list')}</h2>
    <!-- Homework list container -->
    <div>
      <HomeworkSlot {metadata} linkable={false} {hw_id} />
    </div>
  </div>
  <div>
    <h2 class="mb-4 text-2xl font-bold">{__('heading.control_pad')}</h2>
    <HomeworkUpload {hw_id} />
  </div>
</div>
