<script lang="ts">
  import { onMount } from 'svelte';
  import FloatingToolbar from './FloatingToolbar.svelte';

  export let value = '';

  let editorElement: HTMLTextAreaElement;
  let lines: string[] = [];

  onMount(() => {
    if (value) {
      lines = value.split('\n');
    } else {
      lines = [''];
    }
    value = lines.join('\n');
    adjustTextareaHeight();
  });

  function handleInput() {
    lines = value.split('\n');
    adjustTextareaHeight();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const cursorPosition = editorElement.selectionStart;
      const currentLineIndex = value.substr(0, cursorPosition).split('\n').length - 1;
      
      // Ensure there's always an empty line at the end
      if (currentLineIndex === lines.length - 1 && lines[currentLineIndex].trim() !== '') {
        setTimeout(() => {
          value += '\n';
          editorElement.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
        }, 0);
      }
    }
  }

  function adjustTextareaHeight() {
    editorElement.style.height = 'auto';
    editorElement.style.height = editorElement.scrollHeight + 'px';
  }

  function applyStyle(style: 'bold' | 'italic') {
    const start = editorElement.selectionStart;
    const end = editorElement.selectionEnd;
    const selectedText = value.substring(start, end);
    const styledText = style === 'bold' ? `**${selectedText}**` : `*${selectedText}*`;
    
    value = value.substring(0, start) + styledText + value.substring(end);
    
    setTimeout(() => {
      editorElement.focus();
      editorElement.setSelectionRange(start, end + 2);
    }, 0);
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

  function scrollToLine(index: number) {
    const lines = value.split('\n');
    const position = lines.slice(0, index).join('\n').length;
    editorElement.focus();
    editorElement.setSelectionRange(position, position);
    
    const lineHeight = parseFloat(getComputedStyle(editorElement).lineHeight);
    editorElement.scrollTop = index * lineHeight;
  }
</script>

<div class="h-screen w-screen overflow-hidden bg-white p-4 flex flex-col">
  <textarea
    bind:this={editorElement}
    bind:value
    on:input={handleInput}
    on:keydown={handleKeyDown}
    class="flex-grow w-full resize-none border-none outline-none py-1 overflow-y-auto"
    placeholder="..."
  ></textarea>
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
    line-height: 1.5;
  }
</style>