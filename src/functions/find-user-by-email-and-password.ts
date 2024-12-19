import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';

interface getUserByEmailAndPasswordRequest {
  email: string;
  password: string;
}

export async function getUserByEmailAndPassword({
  email,
  password,
}: getUserByEmailAndPasswordRequest) {
  const result = await db
    .select({
      id: users.id,
      email: users.email,
      password: users.password,
    })
    .from(users)
    .where(and(eq(users.email, email), eq(users.password, password)));

  const user = result[0];

  if (!user) {
    throw new Error('User not found');
  }

  return {
    user,
  };
}
