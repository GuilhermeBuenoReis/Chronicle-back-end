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

// src/http/server.ts
var import_fastify = __toESM(require("fastify"));
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");

// src/routes/craete-goals-route.ts
var import_zod2 = require("zod");

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

// src/functions/create-goal.ts
async function createGoal({
  userId,
  title,
  desiredWeeklyFrequency
}) {
  const result = await db.insert(goals).values({
    userId,
    title,
    desiredWeeklyFrequency
  }).returning();
  const goal = result[0];
  return {
    goal
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

// src/routes/craete-goals-route.ts
var createGoalsRoute = async (app2) => {
  app2.post(
    "/goals",
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: "createGoals",
        tags: ["goals"],
        description: "Create a goal",
        body: import_zod2.z.object({
          title: import_zod2.z.string(),
          desiredWeeklyFrequency: import_zod2.z.number().int().min(1).max(7)
        }),
        response: {
          201: import_zod2.z.null()
        }
      }
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const { title, desiredWeeklyFrequency } = request.body;
      await createGoal({
        userId,
        title,
        desiredWeeklyFrequency
      });
      return reply.status(201).send();
    }
  );
};

// src/routes/create-goals-completions-route.ts
var import_zod3 = require("zod");

// src/functions/create-goal-completion.ts
var import_drizzle_orm = require("drizzle-orm");
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

// src/routes/create-goals-completions-route.ts
var createGoalCompletionRoute = async (app2) => {
  app2.post(
    "/completions",
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: "createGoalCompletion",
        tags: ["goals"],
        description: "Complete a goal",
        body: import_zod3.z.object({
          goalId: import_zod3.z.string()
        }),
        response: {
          201: import_zod3.z.null()
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

// src/functions/get-week-pending-goals.ts
var import_dayjs2 = __toESM(require("dayjs"));
var import_drizzle_orm2 = require("drizzle-orm");
async function getWeekPendingGoals({
  userId
}) {
  const firstDayOfWeek = (0, import_dayjs2.default)().startOf("week").toDate();
  const lastDayOfWeek = (0, import_dayjs2.default)().endOf("week").toDate();
  const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
    db.select({
      id: goals.id,
      title: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      createdAt: goals.createAt
    }).from(goals).where((0, import_drizzle_orm2.and)((0, import_drizzle_orm2.lte)(goals.createAt, lastDayOfWeek), (0, import_drizzle_orm2.eq)(goals.userId, userId)))
  );
  const goalCompletionsCount = db.$with("goal_completions-counts").as(
    db.select({
      goalId: goalCompletions.goalId,
      completionCount: (0, import_drizzle_orm2.count)(goalCompletions.id).as("completionCount")
    }).from(goalCompletions).innerJoin(goals, (0, import_drizzle_orm2.eq)(goals.id, goalCompletions.goalId)).where(
      (0, import_drizzle_orm2.and)(
        (0, import_drizzle_orm2.gte)(goalCompletions.createAt, firstDayOfWeek),
        (0, import_drizzle_orm2.lte)(goalCompletions.createAt, lastDayOfWeek),
        (0, import_drizzle_orm2.eq)(goals.userId, userId)
      )
    ).groupBy(goalCompletions.goalId)
  );
  const pendingGoals = await db.with(goalsCreatedUpToWeek, goalCompletionsCount).select({
    id: goalsCreatedUpToWeek.id,
    title: goalsCreatedUpToWeek.title,
    desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
    completionCount: import_drizzle_orm2.sql`
        COALESCE(${goalCompletionsCount.completionCount}, 0)
      `.mapWith(Number)
  }).from(goalsCreatedUpToWeek).leftJoin(
    goalCompletionsCount,
    (0, import_drizzle_orm2.eq)(goalCompletionsCount.goalId, goalsCreatedUpToWeek.id)
  );
  return {
    pendingGoals
  };
}

// src/routes/get-pending-goals-router.ts
var import_zod4 = __toESM(require("zod"));
var getWeekPendingGoalsRoute = async (app2) => {
  app2.get(
    "/pending-goals",
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: "getWeekPendingGoals",
        tags: ["goals"],
        description: "Get pending goals",
        response: {
          200: import_zod4.default.object({
            pendingGoals: import_zod4.default.array(
              import_zod4.default.object({
                id: import_zod4.default.string(),
                title: import_zod4.default.string(),
                desiredWeeklyFrequency: import_zod4.default.number(),
                completionCount: import_zod4.default.number()
              })
            )
          })
        }
      }
    },
    async (request) => {
      const userId = request.user.sub;
      const { pendingGoals } = await getWeekPendingGoals({
        userId
      });
      return { pendingGoals };
    }
  );
};

// src/functions/get-week-summary.ts
var import_dayjs3 = __toESM(require("dayjs"));
var import_drizzle_orm3 = require("drizzle-orm");
async function getWeekSummary({
  userId,
  weekStartsAt
}) {
  const firstDayOfWeek = weekStartsAt;
  const lastDayOfWeek = (0, import_dayjs3.default)(weekStartsAt).endOf("week").toDate();
  const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
    db.select({
      id: goals.id,
      title: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      createdAt: goals.createAt
    }).from(goals).where((0, import_drizzle_orm3.and)((0, import_drizzle_orm3.lte)(goals.createAt, lastDayOfWeek), (0, import_drizzle_orm3.eq)(goals.userId, userId)))
  );
  const goalsCompletedInWeek = db.$with("goal_completed_in_week").as(
    db.select({
      id: goalCompletions.id,
      title: goals.title,
      completedAt: goalCompletions.createAt,
      completedAtDate: import_drizzle_orm3.sql`
          DATE(${goalCompletions.createAt})
        `.as("completedAtDate")
    }).from(goalCompletions).innerJoin(goals, (0, import_drizzle_orm3.eq)(goals.id, goalCompletions.goalId)).where(
      (0, import_drizzle_orm3.and)(
        (0, import_drizzle_orm3.gte)(goalCompletions.createAt, firstDayOfWeek),
        (0, import_drizzle_orm3.lte)(goalCompletions.createAt, lastDayOfWeek),
        (0, import_drizzle_orm3.eq)(goals.userId, userId)
      )
    ).orderBy((0, import_drizzle_orm3.desc)(goalCompletions.createAt))
  );
  const goalsCompletedByWeekDay = db.$with("goals_completed_by_week_day").as(
    db.select({
      completedAtDate: goalsCompletedInWeek.completedAtDate,
      completions: import_drizzle_orm3.sql`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.completedAt}
            )
          )
        `.as("completions")
    }).from(goalsCompletedInWeek).groupBy(goalsCompletedInWeek.completedAtDate).orderBy((0, import_drizzle_orm3.desc)(goalsCompletedInWeek.completedAtDate))
  );
  const result = await db.with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay).select({
    completed: import_drizzle_orm3.sql`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(
      Number
    ),
    total: import_drizzle_orm3.sql`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(
      Number
    ),
    goalsPerDay: import_drizzle_orm3.sql`
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
var import_zod5 = __toESM(require("zod"));
var import_dayjs4 = __toESM(require("dayjs"));
var getWeekSummaryRoute = async (app2) => {
  app2.get(
    "/summary",
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: "getWeekSummary",
        tags: ["goals"],
        description: "Get week summary goals",
        querystring: import_zod5.default.object({
          weekStartsAt: import_zod5.default.coerce.date().optional().default((0, import_dayjs4.default)().startOf("week").toDate())
        }),
        response: {
          200: import_zod5.default.object({
            summary: import_zod5.default.object({
              completed: import_zod5.default.number(),
              total: import_zod5.default.number(),
              goalsPerDay: import_zod5.default.record(
                import_zod5.default.string(),
                import_zod5.default.array(
                  import_zod5.default.object({
                    id: import_zod5.default.string(),
                    title: import_zod5.default.string(),
                    completedAt: import_zod5.default.string()
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

// src/http/server.ts
var import_cors = require("@fastify/cors");
var import_swagger = require("@fastify/swagger");
var import_swagger_ui = require("@fastify/swagger-ui");

// src/routes/authenticate-from-github-route.ts
var import_zod6 = require("zod");

// src/functions/authenticate-from-github-code.ts
var import_drizzle_orm4 = require("drizzle-orm");

// src/modules/github-oauth.ts
async function getAccessTokenFromCode(code) {
  const accessTokenURL = new URL("https://github.com/login/oauth/access_token");
  accessTokenURL.searchParams.append("client_id", env.GITHUB_CLIENT_ID);
  accessTokenURL.searchParams.append("client_secret", env.GITHUB_CLIENT_SECRET);
  accessTokenURL.searchParams.append("code", code);
  const response = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  });
  const { access_token } = await response.json();
  return access_token;
}
async function getUserFromAccessToken(accessToken) {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const data = await response.json();
  console.log(data);
  return data;
}

// src/modules/auth.ts
var import_jose = require("jose");
async function authenticateUser(userId) {
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const token = await new import_jose.SignJWT().setProtectedHeader({ alg: "HS256" }).setSubject(userId).setExpirationTime("1d").setIssuedAt().sign(secret);
  return token;
}

// src/functions/authenticate-from-github-code.ts
async function authenticateFromGithubCode({
  code
}) {
  const accessToken = await getAccessTokenFromCode(code);
  const githubUser = await getUserFromAccessToken(accessToken);
  const result = await db.select().from(users).where((0, import_drizzle_orm4.eq)(users.externalAcountId, githubUser.id));
  let userId;
  const userAlreadyExist = result.length > 0;
  if (userAlreadyExist) {
    userId = result[0].id;
  } else {
    const [insertedUser] = await db.insert(users).values({
      name: githubUser.name,
      email: githubUser.email,
      avatarUrl: githubUser.avatar_url,
      externalAcountId: githubUser.id
    }).returning();
    userId = insertedUser.id;
  }
  const token = await authenticateUser(userId);
  return { token };
}

// src/routes/authenticate-from-github-route.ts
var authenticateFromGithubRoute = async (app2) => {
  app2.post(
    "/auth/github",
    {
      schema: {
        operationId: "authenticateFromGithub",
        tags: ["auth"],
        description: "Authenticate user from Gitub code",
        body: import_zod6.z.object({
          code: import_zod6.z.string()
        }),
        response: {
          201: import_zod6.z.object({ token: import_zod6.z.string() })
        }
      }
    },
    async (request, reply) => {
      const { code } = request.body;
      const { token } = await authenticateFromGithubCode({ code });
      return reply.status(201).send({ token });
    }
  );
};

// src/http/server.ts
var import_jwt = __toESM(require("@fastify/jwt"));

// src/routes/get-profile-route.ts
var import_zod7 = __toESM(require("zod"));

// src/functions/get-user.ts
var import_drizzle_orm5 = require("drizzle-orm");
async function getUser({ userId }) {
  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    avatarUrl: users.avatarUrl
  }).from(users).where((0, import_drizzle_orm5.eq)(users.id, userId));
  const user = result[0];
  return {
    user
  };
}

// src/routes/get-profile-route.ts
var getProfileRoute = async (app2) => {
  app2.get(
    "/profile",
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: "getProfile",
        tags: ["user"],
        description: "Get user profile",
        response: {
          200: import_zod7.default.object({
            profile: import_zod7.default.object({
              id: import_zod7.default.string(),
              name: import_zod7.default.string().nullable(),
              email: import_zod7.default.string().nullable(),
              avatarUrl: import_zod7.default.string().url()
            })
          })
        }
      }
    },
    async (request, reply) => {
      const userId = request.user.sub;
      const { user } = await getUser({
        userId
      });
      return reply.status(200).send({ profile: user });
    }
  );
};

// src/routes/get-user-level-and-experience-route.ts
var import_zod8 = __toESM(require("zod"));

// src/functions/get-user-level-and-experience.ts
var import_drizzle_orm6 = require("drizzle-orm");

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
  }).from(users).where((0, import_drizzle_orm6.eq)(users.id, userId));
  const level = calculateLevelFromExperience(experience);
  const experienceToNextLevel = calculateExperienceForNextLevel(level);
  return {
    experience,
    level,
    experienceToNextLevel
  };
}

// src/routes/get-user-level-and-experience-route.ts
var getUserLevelAndExperienceRoute = async (app2) => {
  app2.get(
    "/profile/gamification",
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: "getUserLevelAndExperience",
        tags: ["user", "gamification"],
        description: "Get user experience and level",
        response: {
          200: import_zod8.default.object({
            experience: import_zod8.default.number(),
            level: import_zod8.default.number(),
            experienceToNextLevel: import_zod8.default.number()
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

// src/http/server.ts
var import_node_path = require("path");
var import_promises = require("fs/promises");

// src/routes/create-folder-route.ts
var import_zod9 = require("zod");

// src/functions/create-folder.ts
async function CreateFolder({ name, userId }) {
  const [result] = await db.insert(folders).values({
    name,
    userId
  }).returning();
  const folder = result;
  return {
    folder: {
      name: result.name
    }
  };
}

// src/routes/create-folder-route.ts
var CreateFoldersRoute = async (app2) => {
  app2.post(
    "/folder",
    {
      schema: {
        operationId: "CreateFolders",
        tags: ["folder"],
        description: "Create a folder",
        body: import_zod9.z.object({
          userId: import_zod9.z.string(),
          name: import_zod9.z.string()
        }),
        response: {
          201: import_zod9.z.null()
        }
      }
    },
    async (request, reply) => {
      const { name, userId } = request.body;
      await CreateFolder({
        userId,
        name
      });
      return reply.status(201).send();
    }
  );
};

// src/routes/create-user-route.ts
var import_zod10 = require("zod");

// src/functions/create-user.ts
async function CreateUser({
  name,
  avatarUrl,
  email,
  password
}) {
  const result = await db.insert(users).values({
    name,
    email,
    password,
    avatarUrl
  }).returning();
  const user = result[0];
  console.log(user);
  return {
    user
  };
}

// src/routes/create-user-route.ts
var CreateUserRoute = async (app2) => {
  app2.post(
    "/user",
    {
      schema: {
        operationId: "CreateUser",
        tags: ["folder"],
        description: "Create a folder",
        body: import_zod10.z.object({
          email: import_zod10.z.string(),
          name: import_zod10.z.string(),
          password: import_zod10.z.string(),
          avatarUrl: import_zod10.z.string()
        }),
        response: {
          201: import_zod10.z.null()
        }
      }
    },
    async (request, reply) => {
      const { name, email, avatarUrl, password } = request.body;
      await CreateUser({
        name,
        email,
        password,
        avatarUrl
      });
      return reply.status(201).send();
    }
  );
};

// src/routes/find-user-by-email-and-password-route.ts
var import_zod11 = __toESM(require("zod"));

// src/functions/find-user-by-email-and-password.ts
var import_drizzle_orm7 = require("drizzle-orm");
async function getUserByEmailAndPassword({
  email,
  password
}) {
  const result = await db.select({
    id: users.id,
    email: users.email,
    password: users.password
  }).from(users).where((0, import_drizzle_orm7.and)((0, import_drizzle_orm7.eq)(users.email, email), (0, import_drizzle_orm7.eq)(users.password, password)));
  const user = result[0];
  if (!user) {
    throw new Error("User not found");
  }
  return {
    user
  };
}

// src/routes/find-user-by-email-and-password-route.ts
var getUserByEmailAndPasswordRoute = async (app2) => {
  app2.post(
    "/auth/find",
    {
      schema: {
        operationId: "getUserByEmailAndPassword",
        tags: ["user", "auth"],
        description: "Get user by email and passowrd",
        body: import_zod11.default.object({
          email: import_zod11.default.string(),
          password: import_zod11.default.string()
        }),
        response: {
          201: import_zod11.default.null()
        }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const { user } = await getUserByEmailAndPassword({ email, password });
      return reply.status(201).send();
    }
  );
};

// src/routes/authenticate-user-route.ts
var import_zod12 = __toESM(require("zod"));

// src/functions/authenticate-user.ts
async function authenticate({
  email,
  password
}) {
  const result = await getUserByEmailAndPassword({ email, password });
  const user = result.user.id;
  const token = await authenticateUser(user);
  return { token };
}

// src/routes/authenticate-user-route.ts
var AuthenticateUserRoute = async (app2) => {
  app2.post(
    "/auth/authenticate",
    {
      schema: {
        operationId: "AuthenticateUserRoute",
        tags: ["user", "auth"],
        description: "Authenticate user",
        body: import_zod12.default.object({
          email: import_zod12.default.string(),
          password: import_zod12.default.string()
        }),
        response: {
          201: import_zod12.default.object({ token: import_zod12.default.string() })
        }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const { token } = await authenticate({ email, password });
      return reply.status(201).send({ token });
    }
  );
};

// src/routes/create-note-router.ts
var import_zod13 = require("zod");

// src/functions/create-note.ts
async function CreateNote({
  userId,
  folderId,
  content,
  title,
  tags
}) {
  const result = await db.insert(notes).values({
    title,
    content,
    userId,
    tags,
    folder_id: folderId
  }).returning();
  const note = result[0];
  return {
    note
  };
}

// src/routes/create-note-router.ts
var CreateNoteRoute = async (app2) => {
  app2.post(
    "/note",
    {
      schema: {
        operationId: "CreateNote",
        tags: ["note"],
        description: "Create a folder",
        body: import_zod13.z.object({
          userId: import_zod13.z.string(),
          title: import_zod13.z.string(),
          content: import_zod13.z.string(),
          tags: import_zod13.z.string().optional(),
          folderId: import_zod13.z.string().optional()
        }),
        response: {
          201: import_zod13.z.null()
        }
      }
    },
    async (request, reply) => {
      const { title, content, tags, userId, folderId } = request.body;
      await CreateNote({
        title,
        content,
        tags,
        userId,
        folderId
      });
      return reply.status(201).send();
    }
  );
};

// src/routes/get-notes-route.ts
var import_zod14 = __toESM(require("zod"));

// src/functions/get-notes.ts
var import_drizzle_orm8 = require("drizzle-orm");
async function getNotes({ userId }) {
  const result = await db.select({
    id: notes.id,
    title: notes.title,
    content: notes.content,
    tags: notes.tags,
    createdAt: notes.createdAt
  }).from(notes).where((0, import_drizzle_orm8.eq)(notes.userId, userId));
  if (!result) {
    throw new Error("Nenhuma nota cadastrada!");
  }
  return {
    result
  };
}

// src/routes/get-notes-route.ts
var getNotesRoute = async (app2) => {
  app2.get(
    "/notes/summary",
    {
      schema: {
        operationId: "getNotesRoute",
        tags: ["notes"],
        description: "Get week summary notes",
        response: {
          200: import_zod14.default.array(
            import_zod14.default.object({
              id: import_zod14.default.string(),
              title: import_zod14.default.string(),
              content: import_zod14.default.string(),
              tags: import_zod14.default.string().nullable(),
              createdAt: import_zod14.default.date()
            })
          )
        }
      }
    },
    async (request, reply) => {
      const userId = "n6u53804o7fjhg08tit8csc1";
      const { result } = await getNotes({ userId });
      return reply.status(200).send(result);
    }
  );
};

// src/routes/find-notes-by-tag-route.ts
var import_zod15 = __toESM(require("zod"));

// src/functions/find-note-by-tag.ts
var import_drizzle_orm9 = require("drizzle-orm");
async function FindNoteByTag({ tags }) {
  const result = await db.select({
    id: notes.id,
    title: notes.title,
    content: notes.content,
    tag: notes.tags,
    createdAt: notes.createdAt
  }).from(notes).where((0, import_drizzle_orm9.and)((0, import_drizzle_orm9.isNotNull)(notes.tags), (0, import_drizzle_orm9.eq)(notes.tags, tags)));
  const notesWithNonNullTags = result.map((note) => ({
    ...note,
    tag: note.tag ?? ""
  }));
  if (notesWithNonNullTags.length === 0) {
    throw new Error("Nenhuma nota encontrada com esta tag!");
  }
  return {
    note: notesWithNonNullTags.length > 0 ? notesWithNonNullTags : []
  };
}

// src/routes/find-notes-by-tag-route.ts
var findNotesByTagsRoute = async (app2) => {
  app2.post(
    "/notes/find",
    {
      schema: {
        operationId: "getUserByEmailAndPassword",
        tags: ["notes", "tags"],
        description: "Get user by email and passowrd",
        body: import_zod15.default.object({
          tags: import_zod15.default.string()
        }),
        response: {
          200: import_zod15.default.object({
            note: import_zod15.default.array(
              import_zod15.default.object({
                id: import_zod15.default.string(),
                title: import_zod15.default.string(),
                content: import_zod15.default.string(),
                tag: import_zod15.default.string(),
                createdAt: import_zod15.default.date()
              })
            )
          }),
          404: import_zod15.default.object({
            message: import_zod15.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { tags } = request.body;
      const { note } = await FindNoteByTag({ tags });
      if (!tags) {
        return reply.status(401).send({ message: "Nenhuma nota cadastrada com esta tag" });
      }
      return reply.status(200).send({ note });
    }
  );
};

// src/routes/find-note-by-id-route.ts
var import_zod16 = __toESM(require("zod"));

// src/functions/find-note-by-id.ts
var import_drizzle_orm10 = require("drizzle-orm");
async function findNoteById({ noteId }) {
  const result = await db.select({
    id: notes.id,
    title: notes.title,
    content: notes.content,
    tags: notes.tags,
    createdAt: notes.createdAt
  }).from(notes).where((0, import_drizzle_orm10.eq)(notes.id, noteId));
  const note = result[0];
  if (!note) {
    throw new Error("Nota n\xE3o encontrada!");
  }
  return {
    note
  };
}

// src/routes/find-note-by-id-route.ts
var findNotesByIdRoute = async (app2) => {
  app2.get(
    "/notes/:id",
    {
      schema: {
        operationId: "findNotesById",
        tags: ["notes", "tags"],
        description: "Find notes by id",
        querystring: import_zod16.default.object({
          id: import_zod16.default.string()
        }),
        response: {
          200: import_zod16.default.object({
            note: import_zod16.default.object({
              id: import_zod16.default.string(),
              title: import_zod16.default.string(),
              content: import_zod16.default.string(),
              tags: import_zod16.default.string().nullable(),
              createdAt: import_zod16.default.date()
            })
          }),
          404: import_zod16.default.object({
            message: import_zod16.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      const notesId = request.query.id;
      const { note } = await findNoteById({ noteId: notesId });
      if (!note) {
        return reply.status(401).send({ message: "Nenhuma nota encontrada." });
      }
      return reply.status(200).send({ note });
    }
  );
};

// src/routes/update-note-route.ts
var import_zod17 = __toESM(require("zod"));

// src/functions/update-note-by-id.ts
var import_drizzle_orm11 = require("drizzle-orm");
async function updateNoteById({
  content,
  title,
  noteId,
  tags
}) {
  const result = await db.update(notes).set({
    title,
    content,
    tags
  }).where((0, import_drizzle_orm11.eq)(notes.id, noteId)).returning();
  console.log("Query Result:", result);
  const updatedNote = result[0];
  if (!updateNoteById) {
    throw new Error("Erro ao atualizar a nota!");
  }
  console.log("Updated Note:", updatedNote);
  return {
    updatedNote
  };
}

// src/routes/update-note-route.ts
var updatedNoteRoute = async (app2) => {
  app2.put(
    "/notes/update/:id",
    {
      schema: {
        operationId: "updatedNote",
        tags: ["notes", "tags"],
        description: "updated note",
        querystring: import_zod17.default.object({
          id: import_zod17.default.string()
        }),
        body: import_zod17.default.object({
          title: import_zod17.default.string().optional(),
          content: import_zod17.default.string().optional(),
          tags: import_zod17.default.string().optional()
        }),
        response: {
          201: import_zod17.default.object({
            updatedNote: import_zod17.default.object({
              id: import_zod17.default.string(),
              title: import_zod17.default.string(),
              content: import_zod17.default.string(),
              tags: import_zod17.default.string().nullable(),
              createdAt: import_zod17.default.date()
            })
          }),
          404: import_zod17.default.object({
            message: import_zod17.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      const notesId = request.query.id;
      const { title, content, tags } = request.body;
      const { updatedNote } = await updateNoteById({
        noteId: notesId,
        title,
        content,
        tags
      });
      if (!updatedNote) {
        return reply.status(401).send({
          message: "N\xE3o foi poss\xEDvel atualizar a nota! Tente novamente mais tarde."
        });
      }
      return reply.status(201).send({ updatedNote });
    }
  );
};

// src/routes/delete-note-by-id-route.ts
var import_zod18 = __toESM(require("zod"));

// src/functions/delete-note-by-id.ts
var import_drizzle_orm12 = require("drizzle-orm");
async function deleteNoteById({ noteId }) {
  const result = await db.delete(notes).where((0, import_drizzle_orm12.eq)(notes.id, noteId));
  return {
    result
  };
}

// src/routes/delete-note-by-id-route.ts
var deleteNoteByIdRoute = async (app2) => {
  app2.delete(
    "/notes/delete/:id",
    {
      // onRequest: [authenticateUserHook],
      schema: {
        operationId: "deleteNoteById",
        tags: ["goals"],
        description: "Get pending goals",
        querystring: import_zod18.default.object({
          id: import_zod18.default.string()
        }),
        response: {
          200: import_zod18.default.object({
            message: import_zod18.default.string()
          }),
          400: import_zod18.default.object({
            message: import_zod18.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      const noteId = request.query.id;
      const { result } = await deleteNoteById({ noteId });
      if (!result) {
        return reply.status(400).send({
          message: "N\xE3o foi poss\xEDvel deletar> a nota! Tente novamente mais tarde."
        });
      }
      return reply.status(200).send({ message: "Nota deletada com sucesso!" });
    }
  );
};

// src/routes/create-taks-route.ts
var import_zod19 = require("zod");

// src/functions/create-task.ts
async function CreateTask({
  userId,
  content,
  title,
  is_completed
}) {
  const result = await db.insert(tasks).values({
    title,
    content,
    userId,
    is_completed
  }).returning();
  const task = result[0];
  return {
    task
  };
}

// src/routes/create-taks-route.ts
var createTaskRoute = async (app2) => {
  app2.post(
    "/task",
    {
      schema: {
        operationId: "Create task",
        tags: ["task"],
        description: "Create a task",
        body: import_zod19.z.object({
          userId: import_zod19.z.string(),
          title: import_zod19.z.string(),
          content: import_zod19.z.string(),
          is_completed: import_zod19.z.boolean()
        }),
        response: {
          201: import_zod19.z.object({
            message: import_zod19.z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { title, content, is_completed, userId } = request.body;
      await CreateTask({
        title,
        content,
        userId,
        is_completed
      });
      return reply.status(201).send({ message: "Tarefa criada com sucesso" });
    }
  );
};

// src/routes/get-task-route.ts
var import_zod20 = __toESM(require("zod"));

// src/functions/get-tasks.ts
var import_drizzle_orm13 = require("drizzle-orm");
async function getTasks({ userId }) {
  const result = await db.select({
    id: tasks.id,
    title: tasks.title,
    content: tasks.content,
    is_completed: tasks.is_completed,
    createAt: tasks.createAt
  }).from(tasks).where((0, import_drizzle_orm13.eq)(tasks.userId, userId));
  if (!result) {
    throw new Error("Nenhuma tarefa cadastrada!");
  }
  return {
    result
  };
}

// src/routes/get-task-route.ts
var getTaskRoute = async (app2) => {
  app2.get(
    "/task/summary",
    {
      schema: {
        operationId: "getNotesRoute",
        tags: ["task"],
        description: "Get tasks",
        response: {
          200: import_zod20.default.array(
            import_zod20.default.object({
              id: import_zod20.default.string(),
              title: import_zod20.default.string(),
              content: import_zod20.default.string(),
              is_completed: import_zod20.default.boolean().nullable(),
              createAt: import_zod20.default.date()
            })
          )
        }
      }
    },
    async (request, reply) => {
      const userId = "n6u53804o7fjhg08tit8csc1";
      const { result } = await getTasks({ userId });
      return reply.status(200).send(result);
    }
  );
};

// src/routes/update-task-by-id-route.ts
var import_zod21 = __toESM(require("zod"));

// src/functions/update-task-by-id.ts
var import_drizzle_orm14 = require("drizzle-orm");
async function updateTaskById({
  content,
  title,
  taskId,
  is_completed
}) {
  const result = await db.update(tasks).set({
    title,
    content,
    is_completed
  }).where((0, import_drizzle_orm14.eq)(tasks.id, taskId)).returning();
  const updatedTask = result[0];
  if (!updateTaskById) {
    throw new Error("Erro ao atualizar a tarefa!");
  }
  return {
    updatedTask
  };
}

// src/routes/update-task-by-id-route.ts
var updatedTaskRoute = async (app2) => {
  app2.put(
    "/task/update/:id",
    {
      schema: {
        operationId: "updatedTask",
        tags: ["task"],
        description: "updated task",
        querystring: import_zod21.default.object({
          id: import_zod21.default.string()
        }),
        body: import_zod21.default.object({
          title: import_zod21.default.string().optional(),
          content: import_zod21.default.string().optional(),
          is_completed: import_zod21.default.boolean().optional()
        }),
        response: {
          201: import_zod21.default.object({
            updatedTask: import_zod21.default.object({
              id: import_zod21.default.string(),
              title: import_zod21.default.string(),
              content: import_zod21.default.string(),
              is_completed: import_zod21.default.boolean().nullable(),
              createAt: import_zod21.default.date()
            })
          }),
          404: import_zod21.default.object({
            message: import_zod21.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      const taskId = request.query.id;
      const { title, content, is_completed } = request.body;
      const { updatedTask } = await updateTaskById({
        title,
        content,
        taskId,
        is_completed
      });
      if (!updatedTask) {
        return reply.status(401).send({
          message: "N\xE3o foi poss\xEDvel atualizar a nota! Tente novamente mais tarde."
        });
      }
      return reply.status(201).send({ updatedTask });
    }
  );
};

// src/routes/delete-task-by-id-route.ts
var import_zod22 = __toESM(require("zod"));

// src/functions/delete-task-by-id.ts
var import_drizzle_orm15 = require("drizzle-orm");
async function deleteTaskById({ taskId }) {
  const result = await db.delete(tasks).where((0, import_drizzle_orm15.eq)(tasks.id, taskId));
  return {
    result
  };
}

// src/routes/delete-task-by-id-route.ts
var deleteTaskByIdRoute = async (app2) => {
  app2.delete(
    "/task/delete/:id",
    {
      // onRequest: [authenticateUserHook],
      schema: {
        operationId: "deleteTaskById",
        tags: ["task"],
        description: "Delete task",
        querystring: import_zod22.default.object({
          id: import_zod22.default.string()
        }),
        response: {
          200: import_zod22.default.object({
            message: import_zod22.default.string()
          }),
          400: import_zod22.default.object({
            message: import_zod22.default.string()
          })
        }
      }
    },
    async (request, reply) => {
      const taskId = request.query.id;
      const { result } = await deleteTaskById({ taskId });
      if (!result) {
        return reply.status(400).send({
          message: "N\xE3o foi poss\xEDvel deletar> a nota! Tente novamente mais tarde."
        });
      }
      return reply.status(200).send({ message: "Tarefa deletada com sucesso!" });
    }
  );
};

// src/http/server.ts
var app = (0, import_fastify.default)().withTypeProvider();
app.register(import_cors.fastifyCors, {
  origin: "*"
});
app.setValidatorCompiler(import_fastify_type_provider_zod.validatorCompiler);
app.setSerializerCompiler(import_fastify_type_provider_zod.serializerCompiler);
app.register(import_jwt.default, {
  secret: env.JWT_SECRET
});
app.register(import_swagger.fastifySwagger, {
  openapi: {
    info: {
      title: "in-orbit",
      version: "1.0.0"
    }
  },
  transform: import_fastify_type_provider_zod.jsonSchemaTransform
});
app.register(import_swagger_ui.fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.register(createGoalsRoute);
app.register(createGoalCompletionRoute);
app.register(getWeekPendingGoalsRoute);
app.register(getWeekSummaryRoute);
app.register(authenticateFromGithubRoute);
app.register(getProfileRoute);
app.register(getUserLevelAndExperienceRoute);
app.register(CreateFoldersRoute);
app.register(CreateUserRoute);
app.register(getUserByEmailAndPasswordRoute);
app.register(AuthenticateUserRoute);
app.register(CreateNoteRoute);
app.register(getNotesRoute);
app.register(findNotesByTagsRoute);
app.register(findNotesByIdRoute);
app.register(updatedNoteRoute);
app.register(deleteNoteByIdRoute);
app.register(createTaskRoute);
app.register(getTaskRoute);
app.register(updatedTaskRoute);
app.register(deleteTaskByIdRoute);
app.listen({
  port: 3333,
  host: "0.0.0.0"
}).then(() => {
  console.log("Http server running \u{1F680}\u{1F680}");
});
if (env.NODE_ENV === "development") {
  const specFile = (0, import_node_path.resolve)(__dirname, "../../swagger.json");
  app.ready().then(() => {
    const spec = JSON.stringify(app.swagger(), null, 2);
    (0, import_promises.writeFile)(specFile, spec).then(() => {
      console.log("Swagger spec generated!");
    });
  });
}
//# sourceMappingURL=server.js.map