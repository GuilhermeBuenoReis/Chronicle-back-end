import {
  pgTable,
  text,
  integer,
  timestamp,
  json,
  boolean,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name'),
  email: text('email'),
  password: text('password'),
  avatarUrl: text('avatar_url').notNull(),
  experience: integer().notNull().default(0),
  externalAcountId: integer('exeternal_acount_id').unique(),
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

export const folders = pgTable('folder', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  createAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
});

export const notes = pgTable('notes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text('title').notNull(),
  content: text('content').notNull(),
  folder_id: text('folder_id').references(() => folders.id),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  tags: json().$type<string[]>(),

  createAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text('title').notNull(),
  content: text('content').notNull(),
  is_completed: boolean().default(false),
  noteId: text('note_id').references(() => notes.id),
  createAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
