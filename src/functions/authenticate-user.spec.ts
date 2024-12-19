import { describe, it, expect } from 'vitest';
import { makeUser } from '../../test/factories/make-user';
import { getUserByEmailAndPassword } from './find-user-by-email-and-password';
import { authenticate } from './authenticate-user';

describe('find user by email and password', () => {
  it('should be able to find user by email and password', async () => {
    const user = await makeUser();

    const result = await authenticate({
      email: user.email!,
      password: user.password!,
    });

    expect(result).toEqual({
      token: expect.any(String),
    });
  });
});
