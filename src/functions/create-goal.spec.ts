import { describe, it, expect } from 'vitest';
import { makeUser } from '../../test/factories/make-user';
import { createGoal } from './create-goal';

describe('create goal', () => {
  it('shoud be able to create a new goal', async () => {
    const user = await makeUser();
    const result = await createGoal({
      userId: user.id,
      title: 'Exemple goal',
      desiredWeeklyFrequency: 2,
    });

    expect(result).toEqual({
      goal: expect.objectContaining({
        id: expect.any(String),
        title: 'Exemple goal',
        desiredWeeklyFrequency: 2,
      }),
    });
  });
});
