import { describe, it, expect } from 'vitest';
import { makeUser } from '../../test/factories/make-user';
import { getUserByEmailAndPassword } from './find-user-by-email-and-password';

describe('find user by email and password', () => {
  it('should be able to find user by email and password', async () => {
    const user = await makeUser();

    const result = await getUserByEmailAndPassword({
      email: user.email!,
      password: user.password!,
    });

    expect(result).toEqual({
      user: {
        id: expect.any(String),
        email: user.email,
        password: user.password,
      },
    });
  });

  it('should throw an error if user is not found', async () => {
    await expect(
      getUserByEmailAndPassword({
        email: 'invalid_email@example.com',
        password: 'invalid_password',
      })
    ).rejects.toThrow();
  });
});
