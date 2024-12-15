import dayjs from 'dayjs';
import { db } from '../db';
import { goalCompletions, goals } from '../db/schema';
import { and, count, eq, gte, lte, sql } from 'drizzle-orm';

interface GetWeekPendingGoalsRequest {
  userId: string;
}

export async function getWeekPendingGoals({
  userId,
}: GetWeekPendingGoalsRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate();
  const lastDayOfWeek = dayjs().endOf('week').toDate();

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createAt,
      })
      .from(goals)
      .where(and(lte(goals.createAt, lastDayOfWeek), eq(goals.userId, userId)))
  );

  const goalCompletionsCount = db.$with('goal_completions-counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('completionCount'),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(
        and(
          gte(goalCompletions.createAt, firstDayOfWeek),
          lte(goalCompletions.createAt, lastDayOfWeek),
          eq(goals.userId, userId)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const pendingGoals = await db
    .with(goalsCreatedUpToWeek, goalCompletionsCount)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
        COALESCE(${goalCompletionsCount.completionCount}, 0)
      `.mapWith(Number),
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalCompletionsCount,
      eq(goalCompletionsCount.goalId, goalsCreatedUpToWeek.id)
    );

  return {
    pendingGoals,
  };
}
