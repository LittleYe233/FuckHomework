<script lang="ts">
  import HomeworkSlot from '~/components/homework_slot.svelte';
  import type { HomeworkMetadata } from '~/lib/types';

  const homeworkSlots: HomeworkMetadata[] = [
    {
      title: 'Homework 1',
      content: 'Content 1',
      semester: '2022 Fall',
      subject: 'Subject A',
      chapter: 'Chapter I, Section 1.1',
      dueTime: new Date('2022-07-12T10:50:28+0800'),
      submissionMethod: 'Uploading files'
    },
    {
      title: 'Homework 2',
      content: 'Content 1',
      subject: 'Subject A',
      chapter: 'Chapter I, Section 1.1',
      dueTime: new Date('1145-01-04T11:45:14+0800'),
      submissionMethod: 'Uploading files'
    },
    {
      title: 'Homework 3',
      content: 'Content 1',
      subject: 'Subject A',
      chapter: 'Chapter I, Section 1.1',
      dueTime: new Date('1145-01-04T11:45:14+0800'),
      submissionMethod: 'Uploading files'
    }
  ];
</script>

<div class="relative flex min-h-screen flex-col overflow-hidden bg-gray-50 px-8 py-6 font-serif sm:py-12">
  <h1 class="my-4 text-center text-3xl font-bold">Homework Submission</h1>
  <div>
    <h2 class="mb-4 text-2xl font-bold">Homework list</h2>
    <!-- Homework list container -->
    <div>
      {#each homeworkSlots as slot}
        <HomeworkSlot metadata={slot} />
      {/each}
    </div>
  </div>
</div>
