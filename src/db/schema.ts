import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name'),
  email: text('email'),
  avatarUrl: text('avatar_url').notNull(),
  experience: integer().notNull().default(0),
  externalAcountId: integer('exeternal_acount_id').notNull().unique(),
});

export const goals = pgTable('goals', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text('title').notNull(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(),
  createAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const goalCompletions = pgTable('goal_completions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  goalId: text('goal_id')
    .references(() => goals.id)
    .notNull(),

  createAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
