import { eq } from 'drizzle-orm';
import { db } from '../db';
import { notes } from '../db/schema';

interface findNoteByIdRequest {
  noteId: string;
}

interface UpdateNoteByIdRequest {
  title: string;
  content: string;
  tags: string;
}

type UpdatedNotePartial = Partial<UpdateNoteByIdRequest> & findNoteByIdRequest;

// AssertionError: expected undefined to deeply equal { noteId: 'id', …(3) }

export async function updateNoteById({
  content,
  title,
  noteId,
  tags,
}: UpdatedNotePartial) {
  const result = await db
    .update(notes)
    .set({
      title,
      content,
      tags,
    })
    .where(eq(notes.id, noteId))
    .returning();

  console.log('Query Result:', result);

  const updatedNote = result[0];

  if (!updateNoteById) {
    throw new Error('Erro ao atualizar a nota!');
  }

  console.log('Updated Note:', updatedNote);

  return {
    updatedNote,
  };
}
