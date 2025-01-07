"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/create-goals-completions-route.ts
var create_goals_completions_route_exports = {};
__export(create_goals_completions_route_exports, {
  createGoalCompletionRoute: () => createGoalCompletionRoute
});
module.exports = __toCommonJS(create_goals_completions_route_exports);
var import_zod2 = require("zod");

// src/functions/create-goal-completion.ts
var import_drizzle_orm = require("drizzle-orm");

// src/db/index.ts
var import_postgres_js = require("drizzle-orm/postgres-js");
var import_postgres = __toESM(require("postgres"));

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  folders: () => folders,
  goalCompletions: () => goalCompletions,
  goals: () => goals,
  notes: () => notes,
  tasks: () => tasks,
  users: () => users
});
var import_pg_core = require("drizzle-orm/pg-core");
var import_cuid2 = require("@paralleldrive/cuid2");
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.text)("id").primaryKey().$defaultFn(() => (0, import_cuid2.createId)()),
  name: (0, import_pg_core.text)("name"),
  email: (0, import_pg_core.text)("email"),
  password: (0, import_pg_core.text)("password"),
  avatarUrl: (0, import_pg_core.text)("avatar_url").notNull(),
  experience: (0, import_pg_core.integer)().notNull().default(0),
  externalAcountId: (0, import_pg_core.integer)("exeternal_acount_id").unique()
});
var goals = (0, import_pg_core.pgTable)("goals", {
  id: (0, import_pg_core.text)("id").primaryKey().$defaultFn(() => (0, import_cuid2.createId)()),
  title: (0, import_pg_core.text)("title").notNull(),
  userId: (0, import_pg_core.text)("user_id").references(() => users.id).notNull(),
  desiredWeeklyFrequency: (0, import_pg_core.integer)("desired_weekly_frequency").notNull(),
  createAt: (0, import_pg_core.timestamp)("created_at", { withTimezone: true }).notNull().defaultNow()
});
var goalCompletions = (0, import_pg_core.pgTable)("goal_completions", {
  id: (0, import_pg_core.text)("id").primaryKey().$defaultFn(() => (0, import_cuid2.createId)()),
  goalId: (0, import_pg_core.text)("goal_id").references(() => goals.id).notNull(),
  createAt: (0, import_pg_core.timestamp)("created_at", { withTimezone: true }).notNull().defaultNow()
});
var folders = (0, import_pg_core.pgTable)("folder", {
  id: (0, import_pg_core.text)("id").primaryKey().$defaultFn(() => (0, import_cuid2.createId)()),
  name: (0, import_pg_core.text)("name").notNull(),
  createAt: (0, import_pg_core.timestamp)("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at", { withTimezone: true }).notNull().defaultNow(),
  userId: (0, import_pg_core.text)("user_id").references(() => users.id).notNull()
});
var notes = (0, import_pg_core.pgTable)("notes", {
  id: (0, import_pg_core.text)("id").primaryKey().$defaultFn(() => (0, import_cuid2.createId)()),
  title: (0, import_pg_core.text)("title").notNull(),
  content: (0, import_pg_core.text)("content").notNull(),
  folder_id: (0, import_pg_core.text)("folder_id").references(() => folders.id),
  tags: (0, import_pg_core.text)("tags"),
  userId: (0, import_pg_core.text)("user_id").references(() => users.id).notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at", { withTimezone: true }).notNull().defaultNow()
});
var tasks = (0, import_pg_core.pgTable)("tasks", {
  id: (0, import_pg_core.text)("id").primaryKey().$defaultFn(() => (0, import_cuid2.createId)()),
  title: (0, import_pg_core.text)("title").notNull(),
  content: (0, import_pg_core.text)("content").notNull(),
  is_completed: (0, import_pg_core.boolean)().default(false),
  userId: (0, import_pg_core.text)("user_id").references(() => users.id).notNull(),
  createAt: (0, import_pg_core.timestamp)("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// src/env.ts
var import_zod = __toESM(require("zod"));
var envSchema = import_zod.default.object({
  NODE_ENV: import_zod.default.enum(["development", "test", "production"]).optional().default("production"),
  DATABASE_URL: import_zod.default.string().url(),
  GITHUB_CLIENT_ID: import_zod.default.string(),
  GITHUB_CLIENT_SECRET: import_zod.default.string(),
  JWT_SECRET: import_zod.default.string()
});
var env = envSchema.parse(process.env);

// src/db/index.ts
var client = (0, import_postgres.default)(env.DATABASE_URL);
var db = (0, import_postgres_js.drizzle)(client, {
  schema: schema_exports,
  logger: env.NODE_ENV === "development"
});

// src/functions/create-goal-completion.ts
var import_dayjs = __toESM(require("dayjs"));
async function createGoalCompletion({
  userId,
  goalId
}) {
  const firstDayOfWeek = (0, import_dayjs.default)().startOf("week").toDate();
  const lastDayOfWeek = (0, import_dayjs.default)().endOf("week").toDate();
  const goalCompletionsCount = db.$with("goal_completions-counts").as(
    db.select({
      goalId: goalCompletions.goalId,
      completionCount: (0, import_drizzle_orm.count)(goalCompletions.id).as("completionCount")
    }).from(goalCompletions).innerJoin(goals, (0, import_drizzle_orm.eq)(goals.id, goalCompletions.goalId)).where(
      (0, import_drizzle_orm.and)(
        (0, import_drizzle_orm.gte)(goalCompletions.createAt, firstDayOfWeek),
        (0, import_drizzle_orm.lte)(goalCompletions.createAt, lastDayOfWeek),
        (0, import_drizzle_orm.eq)(goals.userId, userId)
      )
    ).groupBy(goalCompletions.goalId)
  );
  const result = await db.with(goalCompletionsCount).select({
    desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
    completionCount: import_drizzle_orm.sql`
        COALESCE(${goalCompletionsCount.completionCount}, 0)
      `.mapWith(Number)
  }).from(goals).leftJoin(goalCompletionsCount, (0, import_drizzle_orm.eq)(goalCompletionsCount.goalId, goals.id)).where((0, import_drizzle_orm.and)((0, import_drizzle_orm.eq)(goals.id, goalId), (0, import_drizzle_orm.eq)(goals.userId, userId))).limit(1);
  const { completionCount, desiredWeeklyFrequency } = result[0];
  const isLastCompletionFromGoal = completionCount + 1 === desiredWeeklyFrequency;
  const earnedExperience = isLastCompletionFromGoal ? 7 : 5;
  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error("Goal already completed this week!");
  }
  const goalCompletion = await db.transaction(async (tx) => {
    const [goalCompletion2] = await db.insert(goalCompletions).values({ goalId }).returning();
    await db.update(users).set({
      experience: import_drizzle_orm.sql`
      ${users.experience} + ${earnedExperience}
      `
    }).where((0, import_drizzle_orm.eq)(users.id, userId));
    return goalCompletion2;
  });
  return {
    goalCompletion
  };
}

// src/http/hooks/authenticate-user.ts
async function authenticateUserHook(request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}

// src/routes/create-goals-completions-route.ts
var createGoalCompletionRoute = async (app) => {
  app.post(
    "/completions",
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: "createGoalCompletion",
        tags: ["goals"],
        description: "Complete a goal",
        body: import_zod2.z.object({
          goalId: import_zod2.z.string()
        }),
        response: {
          201: import_zod2.z.null()
        }
      }
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const { goalId } = request.body;
      await createGoalCompletion({
        userId,
        goalId
      });
      return reply.status(201).send();
    }
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createGoalCompletionRoute
});
