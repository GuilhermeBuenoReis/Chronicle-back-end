import { describe, it, expect } from 'vitest';
import { makeUser } from '../../test/factories/make-user';
import { makeGoal } from '../../test/factories/make-goal';
import { makeGoalCompletion } from '../../test/factories/make-goal-completion';
import { getWeekPendingGoals } from './get-week-pending-goals';
import { getWeekSummary } from './get-week-summary';
import dayjs from 'dayjs';

describe('get week summary', () => {
  it('should be able to get week summary', async () => {
    const user = await makeUser();

    const weekStartsAt = dayjs(new Date(2024, 9, 6))
      .startOf('week')
      .toDate();

    const goal1 = await makeGoal({
      userId: user.id,
      title: 'Meditar',
      desiredWeeklyFrequency: 2,
      createAt: weekStartsAt,
    });
    const goal2 = await makeGoal({
      userId: user.id,
      title: 'Nadar',
      desiredWeeklyFrequency: 1,
      createAt: weekStartsAt,
    });
    const goal3 = await makeGoal({
      userId: user.id,
      title: 'Ler',
      desiredWeeklyFrequency: 3,
      createAt: weekStartsAt,
    });

    await makeGoalCompletion({
      goalId: goal1.id,
      createAt: dayjs(weekStartsAt).add(2, 'day').toDate(),
    });

    await makeGoalCompletion({
      goalId: goal2.id,
      createAt: dayjs(weekStartsAt).add(2, 'day').toDate(),
    });

    await makeGoalCompletion({
      goalId: goal3.id,
      createAt: dayjs(weekStartsAt).add(3, 'day').toDate(),
    });

    await makeGoalCompletion({
      goalId: goal3.id,
      createAt: dayjs(weekStartsAt).add(5, 'day').toDate(),
    });

    const result = await getWeekSummary({
      userId: user.id,
      weekStartsAt,
    });

    expect(result).toEqual({
      summary: expect.objectContaining({
        total: 6,
        completed: 4,
        goalsPerDay: expect.objectContaining({
          '2024-10-11': expect.arrayContaining([
            expect.objectContaining({ title: 'Ler' }),
          ]),
          '2024-10-09': expect.arrayContaining([
            expect.objectContaining({ title: 'Ler' }),
          ]),
          '2024-10-08': expect.arrayContaining([
            expect.objectContaining({ title: 'Meditar' }),
            expect.objectContaining({ title: 'Nadar' }),
          ]),
        }),
      }),
    });
  });
});
