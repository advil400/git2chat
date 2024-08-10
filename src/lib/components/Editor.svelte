<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import FloatingToolbar from './FloatingToolbar.svelte';
  import { ydoc, ytext, provider } from '../socket';

  let editorElement: HTMLTextAreaElement;
  let value = '';

  onMount(() => {
    provider.on('sync', (isSynced: boolean) => {
      if (isSynced) {
        value = ytext.toString();
      }
    });

    ytext.observe(event => {
      value = ytext.toString();
      adjustTextareaHeight();
    });
  });

  onDestroy(() => {
    provider.disconnect();
  });

  function handleInput() {
    const diff = value.length - ytext.length;
    if (diff > 0) {
      ytext.insert(ytext.length, value.slice(-diff));
    } else if (diff < 0) {
      ytext.delete(ytext.length + diff, -diff);
    }
    adjustTextareaHeight();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const cursorPosition = editorElement.selectionStart;
      const currentLineIndex = value.substr(0, cursorPosition).split('\n').length - 1;
      
      if (currentLineIndex === value.split('\n').length - 1 && value.trim() !== '') {
        setTimeout(() => {
          ytext.insert(cursorPosition, '\n');
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
    
    ytext.delete(start, end - start);
    ytext.insert(start, styledText);
    
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
</script>

<div class="h-screen w-screen overflow-hidden bg-white p-4 flex flex-col">
  <textarea
    bind:this={editorElement}
    bind:value
    on:input={handleInput}
    on:keydown={handleKeyDown}
    class="flex-grow w-full resize-none border-none outline-none py-1 overflow-y-auto"
    placeholder="Type here..."
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