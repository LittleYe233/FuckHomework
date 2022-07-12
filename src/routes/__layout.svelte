<script>
  import '../app.css';
</script>

<script context="module" lang="ts">
  export const prerender = true;
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<slot />
