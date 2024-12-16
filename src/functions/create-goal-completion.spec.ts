import { describe, it, expect } from 'vitest';
import { makeUser } from '../../test/factories/make-user';
import { makeGoal } from '../../test/factories/make-goal';
import { createGoalCompletion } from './create-goal-completion';
import { makeGoalCompletion } from '../../test/factories/make-goal-completion';

describe('create goal completion', () => {
  it('shoud be able to complete a goal', async () => {
    const user = await makeUser();
    const goal = await makeGoal({ userId: user.id });
    const result = await createGoalCompletion({
      userId: user.id,
      goalId: goal.id,
    });

    expect(result).toEqual({
      goalsCompletion: expect.objectContaining({
        id: expect.any(String),
        goalId: goal.id,
      }),
    });
  });

  it('shoud not be able to complete a goal more times then it expect', async () => {
    const user = await makeUser();
    const goal = await makeGoal({ userId: user.id, desiredWeeklyFrequency: 1 });
    await makeGoalCompletion({ goalId: goal.id });

    await expect(
      createGoalCompletion({
        userId: user.id,
        goalId: goal.id,
      })
    ).rejects.toThrow();
  });
});
