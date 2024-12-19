import { describe, it, expect } from 'vitest';
import { makeUser } from '../../test/factories/make-user';
import { CreateFolder } from './create-folder';
import { makeFolder } from '../../test/factories/make-folder';

describe('create folder', () => {
  it('shoud be able to create a new folder', async () => {
    const user = await makeUser();
    const folder = await makeFolder({ userId: user.id });

    const result = await CreateFolder({
      userId: user.id,
      name: folder.name,
    });

    expect(result).toEqual({
      folder: expect.objectContaining({
        name: expect.any(String),
      }),
    });
  });
});
