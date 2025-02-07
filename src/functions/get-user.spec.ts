import { describe, it, expect } from 'vitest';
import { getUser } from './get-user';
import { makeUser } from '../../test/factories/make-user';

describe('get user', () => {
  it('shoud be able to get a user', async () => {
    const user = await makeUser();

    const result = await getUser({ userId: user.id });

    expect(result).toEqual({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  });
});
