import { db } from '../db';
import { notes } from '../db/schema';

interface CreateNoteByFolderRequest {
  title: string;
  content: string;
  tags?: string | null;
  folderId: string;
  userId: string;
}

export async function createNoteByFolder({
  folderId,
  content,
  title,
  userId,
  tags,
}: CreateNoteByFolderRequest) {
  const result = await db
    .insert(notes)
    .values({
      content,
      title,
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
