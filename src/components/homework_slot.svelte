<script lang="ts">
  export let metadata: import('~/lib/types/index').HomeworkMetadata;

  /**
   * Parse `Date` instance to formatted datetime string.
   * @param dt a `Date` instance
   * @note The locale is forced to zh-CN and the time zone Asia/Shanghai now.
   */
  function parseDateTime(dt: Date): string {
    return dt.toLocaleString('zh-CN', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Shanghai'
    });
  }
</script>

<!-- single homework -->
<div class="relative my-4 rounded-2xl bg-white px-8 py-6 hover:shadow-xl ring-1 ring-gray-900/5">
  <h3 class="mb-3 text-xl font-bold">{metadata.title}</h3>
  <!-- properties -->
  <table class="homework-slot">
    <tbody>
      <tr>
        <td class="pr-6 font-bold">Semester</td>
        <td>{metadata.semester ?? ""}</td>
      </tr>
      <tr>
        <td class="pr-6 font-bold">Subject</td>
        <td>{metadata.subject ?? ""}</td>
      </tr>
      <tr>
        <td class="pr-6 font-bold">Chapter</td>
        <td>{metadata.chapter ?? ""}</td>
      </tr>
      <tr>
        <td class="pr-6 font-bold">Due time</td>
        <td>{metadata.dueTime ? parseDateTime(metadata.dueTime) : ""}</td>
      </tr>
      <tr>
        <td class="pr-6 font-bold">Submission method</td>
        <td>{metadata.submissionMethod ?? ""}</td>
      </tr>
    </tbody>
  </table>
</div>