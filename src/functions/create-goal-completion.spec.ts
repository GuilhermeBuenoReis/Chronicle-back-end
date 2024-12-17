import { describe, it, expect } from 'vitest';
import { makeUser } from '../../test/factories/make-user';
import { makeGoal } from '../../test/factories/make-goal';
import { createGoalCompletion } from './create-goal-completion';
import { makeGoalCompletion } from '../../test/factories/make-goal-completion';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { db } from '../db';

describe('create goal completion', () => {
  it('shoud be able to complete a goal', async () => {
    const user = await makeUser();
    const goal = await makeGoal({ userId: user.id });

    const result = await createGoalCompletion({
      userId: user.id,
      goalId: goal.id,
    });

    expect(result).toEqual({
      goalCompletion: expect.objectContaining({
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

  it('shoud not be increase user experience by 5 when completing a goal', async () => {
    const user = await makeUser({ experience: 0 });
    const goal = await makeGoal({ userId: user.id, desiredWeeklyFrequency: 5 });

    await createGoalCompletion({
      userId: user.id,
      goalId: goal.id,
    });

    const [userOnDb] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id));

    expect(userOnDb.experience).toBe(5);
  });

  it('shoud not be increase user experience by 7 when fully completing a goal', async () => {
    const user = await makeUser({ experience: 0 });
    const goal = await makeGoal({ userId: user.id, desiredWeeklyFrequency: 1 });

    await createGoalCompletion({
      userId: user.id,
      goalId: goal.id,
    });

    const [userOnDb] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id));

    expect(userOnDb.experience).toBe(7);
  });
});
