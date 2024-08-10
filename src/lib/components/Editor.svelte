<script lang="ts">
  import { onMount } from 'svelte';
  import FloatingToolbar from './FloatingToolbar.svelte';

  export let value = '';

  let lines: string[] = [''];
  let activeLineIndex = 0;
  let textareas: HTMLTextAreaElement[] = [];

  onMount(() => {
    lines = value.split('\n');
    if (lines.length === 0) lines = [''];
    lines.push(''); // Always have an empty line at the end
  });

  function handleInput(event: Event, index: number) {
    const target = event.target as HTMLTextAreaElement;
    lines[index] = target.value;
    value = lines.join('\n');

    // Adjust textarea height
    target.style.height = 'auto';
    target.style.height = target.scrollHeight + 'px';

    // Add new line if we're at the last line and it's not empty
    if (index === lines.length - 1 && lines[index].trim() !== '') {
      lines = [...lines, ''];
    }
  }

  function handleKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const target = event.target as HTMLTextAreaElement;
      const cursorPosition = target.selectionStart;
      const currentLine = lines[index];
      
      lines[index] = currentLine.slice(0, cursorPosition);
      lines.splice(index + 1, 0, currentLine.slice(cursorPosition));
      
      activeLineIndex = index + 1;
      setTimeout(() => {
        textareas[activeLineIndex]?.focus();
        textareas[activeLineIndex].selectionStart = textareas[activeLineIndex].selectionEnd = 0;
      }, 0);
    }
  }

  function applyStyle(style: 'bold' | 'italic') {
    const activeTextarea = textareas[activeLineIndex];
    if (activeTextarea) {
      const start = activeTextarea.selectionStart;
      const end = activeTextarea.selectionEnd;
      const selectedText = activeTextarea.value.substring(start, end);
      const styledText = style === 'bold' ? `**${selectedText}**` : `*${selectedText}*`;
      
      activeTextarea.setRangeText(styledText, start, end, 'select');
      handleInput({ target: activeTextarea } as any, activeLineIndex);
    }
  }

  function saveDocument() {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.txt';
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="h-screen w-screen overflow-y-auto bg-white p-4">
  {#each lines as line, index (index)}
    <textarea
      bind:this={textareas[index]}
      value={line}
      on:input={(event) => handleInput(event, index)}
      on:keydown={(event) => handleKeyDown(event, index)}
      on:focus={() => activeLineIndex = index}
      rows="1"
      class="w-full resize-none overflow-hidden border-none outline-none py-1"
      placeholder={index === lines.length - 1 ? "Type here..." : ""}
    ></textarea>
  {/each}
</div>

<FloatingToolbar {applyStyle} {saveDocument} />

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }
</style>