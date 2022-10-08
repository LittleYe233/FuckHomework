<script lang="ts">
  import HomeworkSlot from '~/components/homework_slot.svelte';
  import HomeworkUpload from '~/components/homework_upload/index.svelte';
  import type { HomeworkMetadata } from '~/lib/types/components';
  import type { PageData } from './$types';

  export let data: PageData;
  export let hw_id: string = data.hw_id;
  export let metadata: HomeworkMetadata = data.metadata;
</script>

<div class="relative flex min-h-screen flex-col overflow-hidden bg-gray-100 px-8 py-6 font-serif sm:py-6">
  <h1 class="my-4 text-center text-3xl font-bold">Homework Submission</h1>
  <a href="/" class="text-sky-400 underline hover:text-sky-600 w-fit">Back to homepage</a>
  <div>
    <h2 class="mb-4 text-2xl font-bold">Homework list</h2>
    <!-- Homework list container -->
    <div>
      <HomeworkSlot {metadata} linkable={false} {hw_id} />
    </div>
  </div>
  <div>
    <h2 class="mb-4 text-2xl font-bold">Control Pad</h2>
    <HomeworkUpload {hw_id} />
  </div>
</div>
