import { describe, expect, it, vi } from 'vitest';
import { beforeEach } from 'node:test';
import { authenticateFromGithubCode } from './authenticate-from-github-code';
import { db } from '../db';
import { users } from '../db/schema';
import { and, eq, ne } from 'drizzle-orm';
import * as github from '../modules/github-oauth';
import { makeUser } from '../../test/factories/make-user';

describe('authenticate from github code', () => {
  beforeEach(() => {
    vi.mock('../modules/github-oauth');

    vi.clearAllMocks();
  });

  it('shoud be able to authenticate from github code', async () => {
    vi.spyOn(github, 'getUserFromAccessToken').mockResolvedValueOnce({
      id: 123456789,
      name: 'Jhon doe',
      email: null,
      avatar_url: 'https://github.com/guilhermebuenoreis.png',
    });

    const sut = await authenticateFromGithubCode({
      code: 'semple-github-code',
    });
    expect(sut.token).toEqual(expect.any(String));

    const [userOnDb] = await db
      .select()
      .from(users)
      .where(eq(users.externalAcountId, 123456789));

    expect(userOnDb.name).toEqual('Jhon doe');
  });

  it('shoud be able to authenticate with existing github user', async () => {
    const existing = await makeUser({
      name: 'Jane doe',
    });

    await db
      .delete(users)
      .where(
        and(
          eq(users.externalAcountId, existing.externalAcountId),
          ne(users.id, existing.id)
        )
      );

    vi.spyOn(github, 'getUserFromAccessToken').mockResolvedValueOnce({
      id: existing.externalAcountId,
      name: 'Jhon doe',
      email: null,
      avatar_url: 'https://github.com/guilhermebuenoreis.png',
    });

    const sut = await authenticateFromGithubCode({
      code: 'semple-github-code',
    });

    expect(sut.token).toEqual(expect.any(String));

    const [userOnDb] = await db
      .select()
      .from(users)
      .where(eq(users.externalAcountId, existing.externalAcountId));

    expect(userOnDb.name).toEqual('Jane doe');
  });
});
