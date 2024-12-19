import { db } from '../db';
import { users } from '../db/schema';

interface CreateUserRequest {
  name: string;
  email: string;
  avatarUrl: string;
  password: string;
}
export async function CreateUser({
  name,
  avatarUrl,
  email,
  password,
}: CreateUserRequest) {
  const result = await db
    .insert(users)
    .values({
      name,
      email,
      password,
      avatarUrl,
    })
    .returning();

  const user = result[0];
  console.log(user);

  return {
    user,
  };
}
