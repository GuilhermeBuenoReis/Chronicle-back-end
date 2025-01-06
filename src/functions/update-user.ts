import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';

interface FindUserByIdRequest {
  userId: string;
}

interface UdateUserById {
  name: string | null;
  email: string | null;
  password: string | null;
  avatarUrl: string;
}

type UdateUserPartial = Partial<UdateUserById> & FindUserByIdRequest;

export async function updateUser({
  userId,
  avatarUrl,
  email,
  name,
  password,
}: UdateUserPartial) {
  const result = await db
    .update(users)
    .set({
      name,
      email,
      password,
      avatarUrl,
    })
    .where(eq(users.id, userId))
    .returning();

  const userUpdate = result[0];

  if (!userUpdate) {
    throw new Error('Erro ao atualizar o usuário!');
  }

  return {
    userUpdate,
  };
}
