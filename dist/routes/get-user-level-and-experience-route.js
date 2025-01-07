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

// src/routes/get-user-level-and-experience-route.ts
var get_user_level_and_experience_route_exports = {};
__export(get_user_level_and_experience_route_exports, {
  getUserLevelAndExperienceRoute: () => getUserLevelAndExperienceRoute
});
module.exports = __toCommonJS(get_user_level_and_experience_route_exports);
var import_zod2 = __toESM(require("zod"));

// src/http/hooks/authenticate-user.ts
async function authenticateUserHook(request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}

// src/functions/get-user-level-and-experience.ts
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

// src/modules/gamification.ts
var BASE_EXPERIENCE = 20;
var EXPERIENCE_FACTOR = 1.3;
function calculateLevelFromExperience(experience) {
  return Math.floor(
    Math.log(experience / BASE_EXPERIENCE * (EXPERIENCE_FACTOR - 1) + 1) / Math.log(EXPERIENCE_FACTOR)
  ) + 1;
}
function calculateExperienceForNextLevel(level) {
  return Math.floor(
    BASE_EXPERIENCE * ((EXPERIENCE_FACTOR ** level - 1) / (EXPERIENCE_FACTOR - 1))
  );
}

// src/functions/get-user-level-and-experience.ts
async function getUserLevelAndExperience({
  userId
}) {
  const [{ experience }] = await db.select({
    experience: users.experience
  }).from(users).where((0, import_drizzle_orm.eq)(users.id, userId));
  const level = calculateLevelFromExperience(experience);
  const experienceToNextLevel = calculateExperienceForNextLevel(level);
  return {
    experience,
    level,
    experienceToNextLevel
  };
}

// src/routes/get-user-level-and-experience-route.ts
var getUserLevelAndExperienceRoute = async (app) => {
  app.get(
    "/profile/gamification",
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: "getUserLevelAndExperience",
        tags: ["user", "gamification"],
        description: "Get user experience and level",
        response: {
          200: import_zod2.default.object({
            experience: import_zod2.default.number(),
            level: import_zod2.default.number(),
            experienceToNextLevel: import_zod2.default.number()
          })
        }
      }
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const { experience, experienceToNextLevel, level } = await getUserLevelAndExperience({
        userId
      });
      return reply.status(200).send({ experience, experienceToNextLevel, level });
    }
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getUserLevelAndExperienceRoute
});
