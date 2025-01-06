import { db } from '../db';
import { folders } from '../db/schema';

interface CreateFolderRequest {
  name: string;
  userId: string;
}
export async function CreateFolder({ name, userId }: CreateFolderRequest) {
  const [result] = await db
    .insert(folders)
    .values({
      name,
      userId,
    })
    .returning();

  const folder = result;

  return {
    folder: {
      name: result.name,
    },
  };
}
