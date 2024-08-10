import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

function createNoteStore() {
  const { subscribe, set, update }: Writable<Note[]> = writable([]);

  return {
    subscribe,
    addNote: (content: string) => {
      update(notes => [
        ...notes,
        { 
          id: crypto.randomUUID(),
          content, 
          createdAt: new Date(), 
          updatedAt: new Date() 
        }
      ]);
    },
    updateNote: (id: string, content: string) => {
      update(notes => 
        notes.map(note => 
          note.id === id 
            ? { ...note, content, updatedAt: new Date() } 
            : note
        )
      );
    },
    deleteNote: (id: string) => {
      update(notes => notes.filter(note => note.id !== id));
    },
    reset: () => {
      set([]);
    }
  };
}

export const noteStore = createNoteStore();