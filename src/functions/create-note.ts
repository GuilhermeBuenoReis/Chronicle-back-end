import { db } from '../db';
import { notes } from '../db/schema';

interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string | null;
  userId: string;
}

export async function CreateNote({
  userId,
  content,
  title,
  tags,
}: CreateNoteRequest) {
  const result = await db
    .insert(notes)
    .values({
      title,
      content,
      userId,
      tags,
    })
    .returning();

  const note = result[0];

  return {
    note,
  };
}
