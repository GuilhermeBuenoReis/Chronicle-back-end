import { describe, it, expect } from 'vitest';
import { makeUser } from '../../test/factories/make-user';
import { CreateNote } from './create-note';

describe('create note', () => {
  it('shoud be able to create a new note', async () => {
    const user = await makeUser();
    const result = await CreateNote({
      userId: user.id,
      title: 'Exemple note',
      content: 'aaaaaa',
      tags: ['tag1', 'tag2'],
    });

    expect(result).toEqual({
      note: expect.objectContaining({
        id: expect.any(String),
        title: 'Exemple note',
        content: 'aaaaaa',
        tags: ['tag1', 'tag2'],
      }),
    });
  });
});
