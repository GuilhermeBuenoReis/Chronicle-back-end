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
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
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

// src/routes/get-week-summary-route.ts
var get_week_summary_route_exports = {};
__export(get_week_summary_route_exports, {
  getWeekSummaryRoute: () => getWeekSummaryRoute
});
module.exports = __toCommonJS(get_week_summary_route_exports);

// src/functions/get-week-summary.ts
var import_dayjs = __toESM(require("dayjs"));

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

// src/functions/get-week-summary.ts
var import_drizzle_orm = require("drizzle-orm");
async function getWeekSummary({
  userId,
  weekStartsAt
}) {
  const firstDayOfWeek = weekStartsAt;
  const lastDayOfWeek = (0, import_dayjs.default)(weekStartsAt).endOf("week").toDate();
  const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
    db.select({
      id: goals.id,
      title: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      createdAt: goals.createAt
    }).from(goals).where((0, import_drizzle_orm.and)((0, import_drizzle_orm.lte)(goals.createAt, lastDayOfWeek), (0, import_drizzle_orm.eq)(goals.userId, userId)))
  );
  const goalsCompletedInWeek = db.$with("goal_completed_in_week").as(
    db.select({
      id: goalCompletions.id,
      title: goals.title,
      completedAt: goalCompletions.createAt,
      completedAtDate: import_drizzle_orm.sql`
          DATE(${goalCompletions.createAt})
        `.as("completedAtDate")
    }).from(goalCompletions).innerJoin(goals, (0, import_drizzle_orm.eq)(goals.id, goalCompletions.goalId)).where(
      (0, import_drizzle_orm.and)(
        (0, import_drizzle_orm.gte)(goalCompletions.createAt, firstDayOfWeek),
        (0, import_drizzle_orm.lte)(goalCompletions.createAt, lastDayOfWeek),
        (0, import_drizzle_orm.eq)(goals.userId, userId)
      )
    ).orderBy((0, import_drizzle_orm.desc)(goalCompletions.createAt))
  );
  const goalsCompletedByWeekDay = db.$with("goals_completed_by_week_day").as(
    db.select({
      completedAtDate: goalsCompletedInWeek.completedAtDate,
      completions: import_drizzle_orm.sql`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.completedAt}
            )
          )
        `.as("completions")
    }).from(goalsCompletedInWeek).groupBy(goalsCompletedInWeek.completedAtDate).orderBy((0, import_drizzle_orm.desc)(goalsCompletedInWeek.completedAtDate))
  );
  const result = await db.with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay).select({
    completed: import_drizzle_orm.sql`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(
      Number
    ),
    total: import_drizzle_orm.sql`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(
      Number
    ),
    goalsPerDay: import_drizzle_orm.sql`
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate},
          ${goalsCompletedByWeekDay.completions}
        )
      `
  }).from(goalsCompletedByWeekDay);
  return {
    summary: result[0]
  };
}

// src/routes/get-week-summary-route.ts
var import_zod2 = __toESM(require("zod"));

// src/http/hooks/authenticate-user.ts
async function authenticateUserHook(request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}

// src/routes/get-week-summary-route.ts
var import_dayjs2 = __toESM(require("dayjs"));
var getWeekSummaryRoute = async (app) => {
  app.get(
    "/summary",
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: "getWeekSummary",
        tags: ["goals"],
        description: "Get week summary goals",
        querystring: import_zod2.default.object({
          weekStartsAt: import_zod2.default.coerce.date().optional().default((0, import_dayjs2.default)().startOf("week").toDate())
        }),
        response: {
          200: import_zod2.default.object({
            summary: import_zod2.default.object({
              completed: import_zod2.default.number(),
              total: import_zod2.default.number(),
              goalsPerDay: import_zod2.default.record(
                import_zod2.default.string(),
                import_zod2.default.array(
                  import_zod2.default.object({
                    id: import_zod2.default.string(),
                    title: import_zod2.default.string(),
                    completedAt: import_zod2.default.string()
                  })
                )
              )
            })
          })
        }
      }
    },
    async (request) => {
      const userId = request.user.sub;
      const { weekStartsAt } = request.query;
      const { summary } = await getWeekSummary({ userId, weekStartsAt });
      return { summary };
    }
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getWeekSummaryRoute
});
