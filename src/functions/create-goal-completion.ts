import { count, and, gte, lte, eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { goalCompletions, goals } from '../db/schema';
import dayjs from 'dayjs';

interface CreateGoalCompletionRequest {
  userId: string;
  goalId: string;
}
export async function createGoalCompletion({
  userId,
  goalId,
}: CreateGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate();
  const lastDayOfWeek = dayjs().endOf('week').toDate();

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

  const result = await db
    .with(goalCompletionsCount)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
        COALESCE(${goalCompletionsCount.completionCount}, 0)
      `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalCompletionsCount, eq(goalCompletionsCount.goalId, goals.id))
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
    .limit(1);

  const { completionCount, desiredWeeklyFrequency } = result[0];

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week!');
  }

  const insertResult = await db
    .insert(goalCompletions)
    .values({ goalId })
    .returning();
  const goalsCompletion = insertResult[0];

  return {
    goalsCompletion,
  };
}
