<script lang="ts">
  export let metadata: import('~/lib/types/index').HomeworkMetadata;
  export let linkable: boolean;
  export let hw_id: string;

  import { parseDateTime } from '~/lib/config';
</script>

<!-- single homework -->
<div class="relative my-4 rounded-2xl bg-white px-8 py-6 ring-1 ring-gray-900/5 transition ease-in-out hover:shadow-xl duration-300" on:click="{() => linkable && (window.location.href = `/homework/detail/${hw_id}`)}">
  <h3 class="mb-3 text-xl font-bold">{metadata.title}</h3>
  <!-- properties -->
  <table class="homework-slot">
    <tbody>
      <tr>
        <td class="pr-6 font-bold">Semester</td>
        <td>{metadata.semester ?? ''}</td>
      </tr>
      <tr>
        <td class="pr-6 font-bold">Subject</td>
        <td>{metadata.subject ?? ''}</td>
      </tr>
      <tr>
        <td class="pr-6 font-bold">Chapter</td>
        <td>{metadata.chapter ?? ''}</td>
      </tr>
      <tr>
        <td class="pr-6 font-bold">Due time</td>
        <td>{parseDateTime(metadata.dueTime)}</td>
      </tr>
      <tr>
        <td class="pr-6 font-bold">Submission method</td>
        <td>{metadata.submissionMethod ?? ''}</td>
      </tr>
    </tbody>
  </table>
</div>
