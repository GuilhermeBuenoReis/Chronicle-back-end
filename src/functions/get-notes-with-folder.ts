import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { notes } from '../db/schema';

interface GetNotesWithFolderRequest {
  userId: string;
  folder_id: string;
}

export async function getNotesWithFolder({
  userId,
  folder_id,
}: GetNotesWithFolderRequest) {
  const result = await db
    .select({
      id: notes.id,
      title: notes.title,
      content: notes.content,
      tags: notes.tags,
      folder_id: notes.folder_id,
      createdAt: notes.createdAt,
    })
    .from(notes)
    .where(and(eq(notes.userId, userId), eq(notes.folder_id, folder_id)));

  if (!result) {
    throw new Error('Nenhuma nota encontrada!');
  }

  return {
    result,
  };
}
