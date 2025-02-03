import { eq } from 'drizzle-orm';
import { db } from '../db';
import { folders } from '../db/schema';

interface GetNotesRequest {
  userId: string;
}

export async function getFolder({ userId }: GetNotesRequest) {
  const result = await db
    .select({
      id: folders.id,
      name: folders.name,
      createdAt: folders.createAt,
    })
    .from(folders)
    .where(eq(folders.userId, userId));

  if (!result) {
    throw new Error('Nenhuma nota cadastrada!');
  }

  return {
    result,
  };
}
