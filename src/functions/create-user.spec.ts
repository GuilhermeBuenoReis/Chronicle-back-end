import { describe, it, expect } from 'vitest';
import { CreateUser } from './create-user';

describe('create user', () => {
  it('shoud be able to create a new user', async () => {
    const result = await CreateUser({
      name: 'Guilherme',
      avatarUrl: 'https://github.com/guilhermebuenoreis.png',
      email: 'email@test.com',
      password: '123456',
    });

    expect(result).toEqual({
      user: expect.objectContaining({
        id: expect.any(String),
        name: 'Guilherme',
        email: 'email@test.com',
        password: '123456',
        avatarUrl: expect.any(String),
      }),
    });
  });
});
