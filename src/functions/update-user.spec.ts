import { describe, it, expect } from 'vitest';
import { updateTaskById } from './update-task-by-id';
import { CreateTask } from './create-task';
import { makeUser } from '../../test/factories/make-user';
import { makeTask } from '../../test/factories/make-task';
import { CreateUser } from './create-user';
import { updateUser } from './update-user';

describe('update user by Id', () => {
  it('should be able to update user', async () => {
    const user = await makeUser();

    await CreateUser({
      name: user.name,
      email: user.name,
      password: user.password,
      avatarUrl: user.avatarUrl,
    });

    const result = await updateUser({
      userId: user.id,
      name: user.name,
      email: user.name,
      password: user.password,
      avatarUrl: user.avatarUrl,
    });

    expect(result.userUpdate).toEqual(
      expect.objectContaining({
        userId: user.id,
        name: user.name,
        email: user.name,
        password: user.password,
        avatarUrl: user.avatarUrl,
      })
    );
  });
});
