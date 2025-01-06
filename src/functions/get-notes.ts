import { eq } from 'drizzle-orm';
import { db } from '../db';
import { notes } from '../db/schema';

interface GetNotesRequest {
  userId: string;
}

export async function getNotes({ userId }: GetNotesRequest) {
  const result = await db
    .select({
      id: notes.id,
      title: notes.title,
      content: notes.content,
      tags: notes.tags,
      createdAt: notes.createdAt,
    })
    .from(notes)
    .where(eq(notes.userId, userId));

  if (!result) {
    throw new Error('Nenhuma nota cadastrada!');
  }

  return {
    result,
  };
}
