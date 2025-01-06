import { eq } from 'drizzle-orm';
import { db } from '../db';
import { notes } from '../db/schema';

interface FindNoteByIdRequest {
  noteId: string;
}

export async function findNoteById({ noteId }: FindNoteByIdRequest) {
  const result = await db
    .select({
      id: notes.id,
      title: notes.title,
      content: notes.content,
      tags: notes.tags,
      createdAt: notes.createdAt,
    })
    .from(notes)
    .where(eq(notes.id, noteId));

  const note = result[0];

  if (!note) {
    throw new Error('Nota não encontrada!');
  }

  return {
    note,
  };
}
