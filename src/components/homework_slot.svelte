<script lang="ts">
  import { parseDateTime } from '~/lib/config';

  export let metadata: import('~/lib/types/index').HomeworkMetadata;
  export let linkable: boolean;
  export let hw_id: string;
  // fallback to the default language
  import type { TFunction } from 'i18next';
  import t from '~/lib/i18n';
  
  export let lang: string | null = '';
  export let __: TFunction = t;

  /**
   * Get the link with fixed search parameters.
   * 
   * The interface is like the `URL()` constructor.
   * 
   * **Please use it only for internal use.**
   * @param url The same as the parameter of `URL()`.
   * @returns Returns the string-form URL.
   */
  function getLink(url: string | URL): string {
    let u = typeof url === 'object' ? url.toString() : url;
    // get raw params
    const rawParams = { lang };
    /**
     * standardlize params
     * If the value of a certain key of `rawParams` is a `false`-like value
     * (i.e. `undefined`, `null`, ``), this key will be removed. Other "invalid"
     * values (i.e. `['1']`, `{ foo: 'bar' }`) will be handled by
     * `new URLSearchParams()` as-is.
     */
    const params = Object.fromEntries(Object.entries(rawParams).flatMap(([k, v]) => v ? [[k, v]] : []));
    u += '?' + new URLSearchParams(params).toString();
    return u;
  }
</script>

<!-- single homework -->
<div
  class="relative my-4 rounded-2xl bg-white px-8 py-6 ring-1 ring-gray-900/5 transition ease-in-out hover:shadow-xl duration-300"
  on:click={() => linkable && (window.location.href = getLink(`/homework/detail/${hw_id}`))}
>
  <h3 class="mb-3 text-xl font-bold">{metadata.title}</h3>
  <!-- properties -->
  <table class="homework-slot">
    <tbody>
      <tr>
        <td class="pr-6 font-bold">{__('heading.components.homework_slot.semester')}</td>
        <td>{metadata.semester ?? ''}</td>
      </tr>
      <tr>
        <td class="pr-6 font-bold">{__('heading.components.homework_slot.subject')}</td>
        <td>{metadata.subject ?? ''}</td>
      </tr>
      <tr>
        <td class="pr-6 font-bold">{__('heading.components.homework_slot.chapter')}</td>
        <td>{metadata.chapter ?? ''}</td>
      </tr>
      <tr>
        <td class="pr-6 font-bold">{__('heading.components.homework_slot.due_time')}</td>
        <td>{parseDateTime(metadata.dueTime)}</td>
      </tr>
      <tr>
        <td class="pr-6 font-bold">{__('heading.components.homework_slot.submission_method')}</td>
        <td>{metadata.submissionMethod ?? ''}</td>
      </tr>
    </tbody>
  </table>
</div>
