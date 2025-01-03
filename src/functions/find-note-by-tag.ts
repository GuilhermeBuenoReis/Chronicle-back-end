import { and, eq, isNotNull } from 'drizzle-orm';
import { db } from '../db';
import { notes } from '../db/schema';

interface FidnNoteByTagRequest {
  tags: string;
}

export async function FindNoteByTag({ tags }: FidnNoteByTagRequest) {
  const result = await db
    .select({
      id: notes.id,
      title: notes.title,
      content: notes.content,
      tag: notes.tags,
      createdAt: notes.createdAt,
    })
    .from(notes)
    .where(and(isNotNull(notes.tags), eq(notes.tags, tags)));

  const notesWithNonNullTags = result.map(note => ({
    ...note,
    tag: note.tag ?? '',
  }));

  return {
    note: notesWithNonNullTags.length > 0 ? notesWithNonNullTags : [],
  };
}
