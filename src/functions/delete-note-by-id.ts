import { eq } from 'drizzle-orm';
import { db } from '../db';
import { notes } from '../db/schema';

interface DeleteNoteByIdRequest {
  noteId: string;
}

export async function deleteNoteById({ noteId }: DeleteNoteByIdRequest) {
  const result = await db.delete(notes).where(eq(notes.id, noteId));

  return {
    result,
  };
}
