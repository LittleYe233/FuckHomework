<script lang="ts">
  let uploadedFiles: FileList | null | undefined;

  const submitHomework: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = async (e) => {
    if (!uploadedFiles) {
      return;
    }

    // read all files and convert to a `Blob` object
    let data: Array<{ type: string; size: number; name: string; text: string }> = [];

    for (let i = 0; i < uploadedFiles.length; ++i) {
      let file = uploadedFiles.item(i);
      if (file === null) continue;
      try {
        data.push({
          type: file.type,
          size: file.size,
          name: file.name,
          text: await file.text()
        });
      } catch (e) {}
    }

    let blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

    // send request
    return await fetch('/homework/upload/_test', {
      method: 'POST',
      headers: [['Content-Type', 'application/octet-stream']],
      body: blob
    })
      .then((resp) => (async () => {
        return 'Response: ' + JSON.stringify({
          status: resp.status,
          statusText: resp.statusText,
          text: await resp.text()
        });
      })())
      .catch((err) => {
        return 'Error: ' + JSON.stringify(err);
      });
  };

  // for Svelte await logic only
  let promise: Promise<any>;
  const submitClickFunc: svelte.JSX.EventHandler<SubmitEvent, HTMLFormElement> = (e) => {
    promise = submitHomework(e);
  }
</script>

<div class="relative my-4 rounded-2xl bg-white px-8 py-6 ring-1 ring-gray-900/5 transition ease-in-out hover:shadow-xl duration-300">
  <h3 class="mb-3 text-xl font-bold">Upload homework</h3>
  <!-- detailed information -->
  <p>Please upload your homework files and make sure they meet the conditions below:</p>
  <!-- conditions -->
  <ul class="mx-4 my-4 list-inside list-disc" />
  <form on:submit|preventDefault={submitClickFunc} class="relative flex flex-col mb-2">
    <input type="file" multiple bind:files={uploadedFiles} class="mb-1.5" />
    <input
      type="submit"
      value="Upload"
      class="mt-1.5 text-left rounded-lg border-2 border-gray-100 px-2 py-1 w-fit transition duration-200 ease-in-out hover:shadow-md"
    />
  </form>
  <div class="relative mt-2">
    <h4 class="mb-2 text-lg font-bold">Result</h4>
    <p>
      {#await promise}
        Awaiting result...
      {:then resp} 
        {resp}
      {/await}
    </p>
  </div>
</div>
