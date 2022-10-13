<script lang="ts">
  import HomeworkSlot from '~/components/homework_slot.svelte';
  import HomeworkUpload from '~/components/homework_upload/index.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
  export let { lang, __, hw_id, metadata } = data;

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

<div class="relative flex min-h-screen flex-col overflow-hidden bg-gray-100 px-8 py-6 font-serif sm:py-6">
  <h1 class="my-4 text-center text-3xl font-bold">{__('heading.homework.submission')}</h1>
  <a href={getLink('/')} class="text-sky-400 underline hover:text-sky-600 w-fit">{__('control.homepage')}</a>
  <div>
    <h2 class="mb-4 text-2xl font-bold">{__('heading.homework.list')}</h2>
    <!-- Homework list container -->
    <div>
      <HomeworkSlot {metadata} linkable={false} {hw_id} {__} />
    </div>
  </div>
  <div>
    <h2 class="mb-4 text-2xl font-bold">{__('heading.control_pad')}</h2>
    <HomeworkUpload {hw_id} {__} />
  </div>
</div>
