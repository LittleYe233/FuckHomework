<script lang="ts">
  export let hw_id: string;
  export let lang: string = '';

  import ConditionView from '../condition_view/index.svelte';
  import base64ArrayBuffer from '$lib/base64ArrayBuffer';
  import { cfg } from '$lib/config';
  import type { FileUploadData } from '$lib/types/components';

  const rules = cfg.homework.entries[parseInt(hw_id)].rules;

  let uploadedFiles: FileList | null | undefined;

  const submitHomework = async () => {
    let result = '',
      resultFriendly: {
        status: string;
        message: string;
        files: {
          filename: string;
          verdict: string;
        }[];
      } = {
        status: '',
        message: '',
        files: []
      };

    /**
     * @note FRONTEND
     */

    if (!uploadedFiles) {
      return {
        nerd: 'Error: No input files.',
        result: {
          status: 'Failed',
          message: 'No input files',
          files: []
        }
      };
    }

    // read all files and convert to a `Blob` object
    let data: FileUploadData[] = [];

    for (let i = 0; i < uploadedFiles.length; ++i) {
      let file = uploadedFiles.item(i);
      if (file === null) continue;
      try {
        const d = {
          type: file.type,
          size: file.size,
          name: file.name,
          // text: await file.text(),
          text64: base64ArrayBuffer(await file.arrayBuffer())
        } as FileUploadData;

        const [_r, _ret] = (() => {
          for (const r of rules) {
            const homework = cfg.homework.entries[parseInt(hw_id)];
            const ret = r.validate(d, { homework });
            if (ret.valid === false) {
              return [r, ret];
            }
          }
          return [];
        })();
        if (typeof _r !== 'undefined') {
          // invalid file
          resultFriendly.status = 'Failed';
          resultFriendly.message = 'Failed to upload some files';
          const failedFile = {
            filename: file.name,
            verdict: _ret?.message ?? JSON.stringify(_ret)
          };
          resultFriendly.files.push(failedFile as never);
          result += `Error: File (${i + 1}/${uploadedFiles.length}) "${
            failedFile.filename
          }" fails front-end validation. First failed rule: ${_r}. Verdict: ${JSON.stringify(_ret)}\n`;
        } else {
          data.push(d);
        }
      } catch (e) {} // eslint-disable-line no-empty
    }

    if (!data.length) {
      result += 'No files are uploaded.';
      resultFriendly.message = 'Failed to upload all files';
      return {
        nerd: result,
        result: resultFriendly
      };
    }

    let blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

    /**
     * @note BACKEND
     */

    // send request
    result += await fetch(`/homework/upload/${hw_id}`, {
      method: 'POST',
      headers: [['Content-Type', 'application/octet-stream']],
      body: blob
    })
      .then((resp) =>
        (async () => {
          if (resp.status === 200) {
            resultFriendly.status = 'Passed';
            if (resultFriendly.files.length) {
              resultFriendly.message = 'Failed to upload some files';
            } else {
              resultFriendly.message = 'Succeeded to upload all files';
            }
          } else {
            resultFriendly.status = 'Failed';
            let text;
            try {
              text = (await resp.clone().json()).message;
            } catch {
              text = resp.status.toString() + ' ' + resp.statusText;
            }
            resultFriendly.message += ' ' + text;
          }
          return (
            'Response: ' +
            JSON.stringify({
              status: resp.status,
              statusText: resp.statusText,
              text: await resp.text()
            })
          );
        })()
      )
      .catch((err) => {
        resultFriendly.status = 'Failed';
        resultFriendly.message += ' ' + err;
        return 'Error: ' + err;
      });

    return {
      nerd: result,
      result: resultFriendly
    };
  };

  // for Svelte await logic only
  let promise: Promise<{
    result: {
      status: string;
      message: string;
      files: {
        filename: string;
        verdict: string;
      }[];
    };
    nerd: string;
  }>;
  const submitClickFunc = () => {
    promise = submitHomework();
  };

  // fallback to the default language
  import type { TFunction } from 'i18next';
  
  export let __: TFunction;
</script>

<div class="relative my-4 rounded-2xl bg-white px-8 py-6 ring-1 ring-gray-900/5 transition ease-in-out hover:shadow-xl duration-300">
  <h3 class="mb-3 text-xl font-bold">{__('homework_upload:heading.upload_homework')}</h3>
  <!-- detailed information -->
  <p>{__('homework_upload:normal.description')}</p>
  <ConditionView {rules} hw_id={parseInt(hw_id)} {lang} {__} />
  <form on:submit|preventDefault={submitClickFunc} class="relative flex flex-col mb-2">
    <input type="file" multiple bind:files={uploadedFiles} class="mb-1.5" />
    <input
      type="submit"
      value="Upload"
      class="mt-1.5 text-left rounded-lg border-2 border-gray-100 px-2 py-1 w-fit transition duration-200 ease-in-out hover:shadow-md"
    />
  </form>
  <div class="relative mt-2">
    <h4 class="mb-2 text-lg font-bold">{__('homework_upload:heading.result')}</h4>
    {#await promise}
      <div class="relative mt-2 p-2">{__('homework_upload:normal.await_result')}</div>
    {:then resp}
      <!-- avoid `resp` being undefined -->
      {#if resp}
        <div class="relative mt-2 grid grid-cols-[repeat(2,_minmax(0,_max-content))] p-2">
          <span class="font-bold border-2 p-1.5">{__('homework_upload:response.status')}</span>
          {#if resp.result.status === 'Passed'}
            <span class="border-2 p-1.5 text-[#5BCEFA]">{__('homework_upload:response.passed')}</span>
          {:else if resp.result.status === 'Failed'}
            <span class="border-2 p-1.5 text-[#F5AAB9]">{__('homework_upload:response.failed')}</span>
          {/if}
          <span class="font-bold border-2 p-1.5">{__('homework_upload:response.message')}</span><span class="border-2 p-1.5">{resp.result.message}</span>
          {#if resp.result.files.length}
            <span class="font-bold border-2 p-1.5">{__('homework_upload:response.filename')}</span><span class="font-bold border-2 p-1.5">{__('homework_upload:response.verdict')}</span>
            {#each resp.result.files as f}
              <span class="break-all border-2 p-1.5">
                <code>{f.filename}</code>
              </span><span class="border-2 p-1.5">{f.verdict}</span>
            {/each}
          {/if}
        </div>
      {:else}
        <div class="relative mt-2">{__('homework_upload:normal.await_result')}</div>
      {/if}
    {/await}
  </div>
  <div class="relative mt-2">
    <h4 class="mb-2 text-lg font-bold">{__('homework_upload:heading.output_nerd')}</h4>
    <details>
      <summary>{__('homework_upload:control.click_to_show_hide')}</summary>

      <code class="break-all whitespace-pre-line">
        {#await promise}
          {__('homework_upload:normal.await_result')}
        {:then resp}
          {#if resp}
            {resp.nerd}
          {:else}
            {__('homework_upload:normal.await_result')}
          {/if}
        {/await}
      </code>
    </details>
  </div>
</div>
