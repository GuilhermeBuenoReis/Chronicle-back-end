import dayjs from 'dayjs';
import { db } from '../db';
import { notes } from '../db/schema';
import { and, eq, gte, lte, sql } from 'drizzle-orm';

interface getNoteRequest {
  userId: string;
}

export async function getNote({ userId }: getNoteRequest) {
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

  return {
    result,
  };
}
