import { db } from '../db';
import { notes } from '../db/schema';

interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string;
  folderId?: string;
  userId: string;
}

export async function CreateNote({
  userId,
  folderId,
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
      folder_id: folderId,
    })
    .returning();

  const note = result[0];

  return {
    note,
  };
}
