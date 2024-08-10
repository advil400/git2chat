<script lang="ts">
  import Editor from '$lib/components/Editor.svelte';
  import { onMount } from 'svelte';

  let editorContent = '';
  let editorReady = false;

  onMount(() => {
    editorReady = true;
  });
</script>

{#if editorReady}
  <Editor bind:value={editorContent} />
{:else}
  <div class="flex items-center justify-center h-screen w-screen">
    <p>Loading editor...</p>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>