var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/http/server.ts
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";

// src/routes/craete-goals-route.ts
import { z as z2 } from "zod";

// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

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
import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
var users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  avatarUrl: text("avatar_url").notNull(),
  experience: integer().notNull().default(0),
  externalAcountId: integer("exeternal_acount_id").unique()
});
var goals = pgTable("goals", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  title: text("title").notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  desiredWeeklyFrequency: integer("desired_weekly_frequency").notNull(),
  createAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
var goalCompletions = pgTable("goal_completions", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  goalId: text("goal_id").references(() => goals.id).notNull(),
  createAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
var folders = pgTable("folder", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  createAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  userId: text("user_id").references(() => users.id).notNull()
});
var notes = pgTable("notes", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  folder_id: text("folder_id").references(() => folders.id),
  tags: text("tags"),
  userId: text("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
var tasks = pgTable("tasks", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  is_completed: boolean().default(false),
  userId: text("user_id").references(() => users.id).notNull(),
  createAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

// src/env.ts
import z from "zod";
var envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).optional().default("production"),
  DATABASE_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  JWT_SECRET: z.string()
});
var env = envSchema.parse(process.env);

// src/db/index.ts
var client = postgres(env.DATABASE_URL);
var db = drizzle(client, {
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
        body: z2.object({
          title: z2.string(),
          desiredWeeklyFrequency: z2.number().int().min(1).max(7)
        }),
        response: {
          201: z2.null()
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
import { z as z3 } from "zod";

// src/functions/create-goal-completion.ts
import { count, and, gte, lte, eq, sql } from "drizzle-orm";
import dayjs from "dayjs";
async function createGoalCompletion({
  userId,
  goalId
}) {
  const firstDayOfWeek = dayjs().startOf("week").toDate();
  const lastDayOfWeek = dayjs().endOf("week").toDate();
  const goalCompletionsCount = db.$with("goal_completions-counts").as(
    db.select({
      goalId: goalCompletions.goalId,
      completionCount: count(goalCompletions.id).as("completionCount")
    }).from(goalCompletions).innerJoin(goals, eq(goals.id, goalCompletions.goalId)).where(
      and(
        gte(goalCompletions.createAt, firstDayOfWeek),
        lte(goalCompletions.createAt, lastDayOfWeek),
        eq(goals.userId, userId)
      )
    ).groupBy(goalCompletions.goalId)
  );
  const result = await db.with(goalCompletionsCount).select({
    desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
    completionCount: sql`
        COALESCE(${goalCompletionsCount.completionCount}, 0)
      `.mapWith(Number)
  }).from(goals).leftJoin(goalCompletionsCount, eq(goalCompletionsCount.goalId, goals.id)).where(and(eq(goals.id, goalId), eq(goals.userId, userId))).limit(1);
  const { completionCount, desiredWeeklyFrequency } = result[0];
  const isLastCompletionFromGoal = completionCount + 1 === desiredWeeklyFrequency;
  const earnedExperience = isLastCompletionFromGoal ? 7 : 5;
  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error("Goal already completed this week!");
  }
  const goalCompletion = await db.transaction(async (tx) => {
    const [goalCompletion2] = await db.insert(goalCompletions).values({ goalId }).returning();
    await db.update(users).set({
      experience: sql`
      ${users.experience} + ${earnedExperience}
      `
    }).where(eq(users.id, userId));
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
        body: z3.object({
          goalId: z3.string()
        }),
        response: {
          201: z3.null()
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
import dayjs2 from "dayjs";
import { and as and2, count as count2, eq as eq2, gte as gte2, lte as lte2, sql as sql2 } from "drizzle-orm";
async function getWeekPendingGoals({
  userId
}) {
  const firstDayOfWeek = dayjs2().startOf("week").toDate();
  const lastDayOfWeek = dayjs2().endOf("week").toDate();
  const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
    db.select({
      id: goals.id,
      title: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      createdAt: goals.createAt
    }).from(goals).where(and2(lte2(goals.createAt, lastDayOfWeek), eq2(goals.userId, userId)))
  );
  const goalCompletionsCount = db.$with("goal_completions-counts").as(
    db.select({
      goalId: goalCompletions.goalId,
      completionCount: count2(goalCompletions.id).as("completionCount")
    }).from(goalCompletions).innerJoin(goals, eq2(goals.id, goalCompletions.goalId)).where(
      and2(
        gte2(goalCompletions.createAt, firstDayOfWeek),
        lte2(goalCompletions.createAt, lastDayOfWeek),
        eq2(goals.userId, userId)
      )
    ).groupBy(goalCompletions.goalId)
  );
  const pendingGoals = await db.with(goalsCreatedUpToWeek, goalCompletionsCount).select({
    id: goalsCreatedUpToWeek.id,
    title: goalsCreatedUpToWeek.title,
    desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
    completionCount: sql2`
        COALESCE(${goalCompletionsCount.completionCount}, 0)
      `.mapWith(Number)
  }).from(goalsCreatedUpToWeek).leftJoin(
    goalCompletionsCount,
    eq2(goalCompletionsCount.goalId, goalsCreatedUpToWeek.id)
  );
  return {
    pendingGoals
  };
}

// src/routes/get-pending-goals-router.ts
import z4 from "zod";
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
          200: z4.object({
            pendingGoals: z4.array(
              z4.object({
                id: z4.string(),
                title: z4.string(),
                desiredWeeklyFrequency: z4.number(),
                completionCount: z4.number()
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
import dayjs3 from "dayjs";
import { and as and3, desc, eq as eq3, gte as gte3, lte as lte3, sql as sql3 } from "drizzle-orm";
async function getWeekSummary({
  userId,
  weekStartsAt
}) {
  const firstDayOfWeek = weekStartsAt;
  const lastDayOfWeek = dayjs3(weekStartsAt).endOf("week").toDate();
  const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
    db.select({
      id: goals.id,
      title: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      createdAt: goals.createAt
    }).from(goals).where(and3(lte3(goals.createAt, lastDayOfWeek), eq3(goals.userId, userId)))
  );
  const goalsCompletedInWeek = db.$with("goal_completed_in_week").as(
    db.select({
      id: goalCompletions.id,
      title: goals.title,
      completedAt: goalCompletions.createAt,
      completedAtDate: sql3`
          DATE(${goalCompletions.createAt})
        `.as("completedAtDate")
    }).from(goalCompletions).innerJoin(goals, eq3(goals.id, goalCompletions.goalId)).where(
      and3(
        gte3(goalCompletions.createAt, firstDayOfWeek),
        lte3(goalCompletions.createAt, lastDayOfWeek),
        eq3(goals.userId, userId)
      )
    ).orderBy(desc(goalCompletions.createAt))
  );
  const goalsCompletedByWeekDay = db.$with("goals_completed_by_week_day").as(
    db.select({
      completedAtDate: goalsCompletedInWeek.completedAtDate,
      completions: sql3`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.completedAt}
            )
          )
        `.as("completions")
    }).from(goalsCompletedInWeek).groupBy(goalsCompletedInWeek.completedAtDate).orderBy(desc(goalsCompletedInWeek.completedAtDate))
  );
  const result = await db.with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay).select({
    completed: sql3`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(
      Number
    ),
    total: sql3`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(
      Number
    ),
    goalsPerDay: sql3`
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
import z5 from "zod";
import dayjs4 from "dayjs";
var getWeekSummaryRoute = async (app2) => {
  app2.get(
    "/summary",
    {
      onRequest: [authenticateUserHook],
      schema: {
        operationId: "getWeekSummary",
        tags: ["goals"],
        description: "Get week summary goals",
        querystring: z5.object({
          weekStartsAt: z5.coerce.date().optional().default(dayjs4().startOf("week").toDate())
        }),
        response: {
          200: z5.object({
            summary: z5.object({
              completed: z5.number(),
              total: z5.number(),
              goalsPerDay: z5.record(
                z5.string(),
                z5.array(
                  z5.object({
                    id: z5.string(),
                    title: z5.string(),
                    completedAt: z5.string()
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
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

// src/routes/authenticate-from-github-route.ts
import { z as z6 } from "zod";

// src/functions/authenticate-from-github-code.ts
import { eq as eq4 } from "drizzle-orm";

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
import { SignJWT } from "jose";
async function authenticateUser(userId) {
  const secret = new TextEncoder().encode(env.JWT_SECRET);
  const token = await new SignJWT().setProtectedHeader({ alg: "HS256" }).setSubject(userId).setExpirationTime("1d").setIssuedAt().sign(secret);
  return token;
}

// src/functions/authenticate-from-github-code.ts
async function authenticateFromGithubCode({
  code
}) {
  const accessToken = await getAccessTokenFromCode(code);
  const githubUser = await getUserFromAccessToken(accessToken);
  const result = await db.select().from(users).where(eq4(users.externalAcountId, githubUser.id));
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
        body: z6.object({
          code: z6.string()
        }),
        response: {
          201: z6.object({ token: z6.string() })
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
import fastifyJwt from "@fastify/jwt";

// src/routes/get-profile-route.ts
import z7 from "zod";

// src/functions/get-user.ts
import { eq as eq5 } from "drizzle-orm";
async function getUser({ userId }) {
  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    avatarUrl: users.avatarUrl
  }).from(users).where(eq5(users.id, userId));
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
          200: z7.object({
            profile: z7.object({
              id: z7.string(),
              name: z7.string().nullable(),
              email: z7.string().nullable(),
              avatarUrl: z7.string().url()
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
import z8 from "zod";

// src/functions/get-user-level-and-experience.ts
import { eq as eq6 } from "drizzle-orm";

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
  }).from(users).where(eq6(users.id, userId));
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
          200: z8.object({
            experience: z8.number(),
            level: z8.number(),
            experienceToNextLevel: z8.number()
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
import { resolve } from "node:path";
import { writeFile } from "node:fs/promises";

// src/routes/create-folder-route.ts
import { z as z9 } from "zod";

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
        body: z9.object({
          userId: z9.string(),
          name: z9.string()
        }),
        response: {
          201: z9.null()
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
import { z as z10 } from "zod";

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
        body: z10.object({
          email: z10.string(),
          name: z10.string(),
          password: z10.string(),
          avatarUrl: z10.string()
        }),
        response: {
          201: z10.null()
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
import z11 from "zod";

// src/functions/find-user-by-email-and-password.ts
import { and as and4, eq as eq7 } from "drizzle-orm";
async function getUserByEmailAndPassword({
  email,
  password
}) {
  const result = await db.select({
    id: users.id,
    email: users.email,
    password: users.password
  }).from(users).where(and4(eq7(users.email, email), eq7(users.password, password)));
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
        body: z11.object({
          email: z11.string(),
          password: z11.string()
        }),
        response: {
          201: z11.null()
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
import z12 from "zod";

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
        body: z12.object({
          email: z12.string(),
          password: z12.string()
        }),
        response: {
          201: z12.object({ token: z12.string() })
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
import { z as z13 } from "zod";

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
        body: z13.object({
          userId: z13.string(),
          title: z13.string(),
          content: z13.string(),
          tags: z13.string().optional(),
          folderId: z13.string().optional()
        }),
        response: {
          201: z13.null()
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
import z14 from "zod";

// src/functions/get-notes.ts
import { eq as eq8 } from "drizzle-orm";
async function getNotes({ userId }) {
  const result = await db.select({
    id: notes.id,
    title: notes.title,
    content: notes.content,
    tags: notes.tags,
    createdAt: notes.createdAt
  }).from(notes).where(eq8(notes.userId, userId));
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
          200: z14.array(
            z14.object({
              id: z14.string(),
              title: z14.string(),
              content: z14.string(),
              tags: z14.string().nullable(),
              createdAt: z14.date()
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
import z15 from "zod";

// src/functions/find-note-by-tag.ts
import { and as and5, eq as eq9, isNotNull } from "drizzle-orm";
async function FindNoteByTag({ tags }) {
  const result = await db.select({
    id: notes.id,
    title: notes.title,
    content: notes.content,
    tag: notes.tags,
    createdAt: notes.createdAt
  }).from(notes).where(and5(isNotNull(notes.tags), eq9(notes.tags, tags)));
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
        body: z15.object({
          tags: z15.string()
        }),
        response: {
          200: z15.object({
            note: z15.array(
              z15.object({
                id: z15.string(),
                title: z15.string(),
                content: z15.string(),
                tag: z15.string(),
                createdAt: z15.date()
              })
            )
          }),
          404: z15.object({
            message: z15.string()
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
import z16 from "zod";

// src/functions/find-note-by-id.ts
import { eq as eq10 } from "drizzle-orm";
async function findNoteById({ noteId }) {
  const result = await db.select({
    id: notes.id,
    title: notes.title,
    content: notes.content,
    tags: notes.tags,
    createdAt: notes.createdAt
  }).from(notes).where(eq10(notes.id, noteId));
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
        querystring: z16.object({
          id: z16.string()
        }),
        response: {
          200: z16.object({
            note: z16.object({
              id: z16.string(),
              title: z16.string(),
              content: z16.string(),
              tags: z16.string().nullable(),
              createdAt: z16.date()
            })
          }),
          404: z16.object({
            message: z16.string()
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
import z17 from "zod";

// src/functions/update-note-by-id.ts
import { eq as eq11 } from "drizzle-orm";
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
  }).where(eq11(notes.id, noteId)).returning();
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
        querystring: z17.object({
          id: z17.string()
        }),
        body: z17.object({
          title: z17.string().optional(),
          content: z17.string().optional(),
          tags: z17.string().optional()
        }),
        response: {
          201: z17.object({
            updatedNote: z17.object({
              id: z17.string(),
              title: z17.string(),
              content: z17.string(),
              tags: z17.string().nullable(),
              createdAt: z17.date()
            })
          }),
          404: z17.object({
            message: z17.string()
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
import z18 from "zod";

// src/functions/delete-note-by-id.ts
import { eq as eq12 } from "drizzle-orm";
async function deleteNoteById({ noteId }) {
  const result = await db.delete(notes).where(eq12(notes.id, noteId));
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
        querystring: z18.object({
          id: z18.string()
        }),
        response: {
          200: z18.object({
            message: z18.string()
          }),
          400: z18.object({
            message: z18.string()
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
import { z as z19 } from "zod";

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
        body: z19.object({
          userId: z19.string(),
          title: z19.string(),
          content: z19.string(),
          is_completed: z19.boolean()
        }),
        response: {
          201: z19.object({
            message: z19.string()
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
import z20 from "zod";

// src/functions/get-tasks.ts
import { eq as eq13 } from "drizzle-orm";
async function getTasks({ userId }) {
  const result = await db.select({
    id: tasks.id,
    title: tasks.title,
    content: tasks.content,
    is_completed: tasks.is_completed,
    createAt: tasks.createAt
  }).from(tasks).where(eq13(tasks.userId, userId));
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
          200: z20.array(
            z20.object({
              id: z20.string(),
              title: z20.string(),
              content: z20.string(),
              is_completed: z20.boolean().nullable(),
              createAt: z20.date()
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
import z21 from "zod";

// src/functions/update-task-by-id.ts
import { eq as eq14 } from "drizzle-orm";
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
  }).where(eq14(tasks.id, taskId)).returning();
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
        querystring: z21.object({
          id: z21.string()
        }),
        body: z21.object({
          title: z21.string().optional(),
          content: z21.string().optional(),
          is_completed: z21.boolean().optional()
        }),
        response: {
          201: z21.object({
            updatedTask: z21.object({
              id: z21.string(),
              title: z21.string(),
              content: z21.string(),
              is_completed: z21.boolean().nullable(),
              createAt: z21.date()
            })
          }),
          404: z21.object({
            message: z21.string()
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
import z22 from "zod";

// src/functions/delete-task-by-id.ts
import { eq as eq15 } from "drizzle-orm";
async function deleteTaskById({ taskId }) {
  const result = await db.delete(tasks).where(eq15(tasks.id, taskId));
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
        querystring: z22.object({
          id: z22.string()
        }),
        response: {
          200: z22.object({
            message: z22.string()
          }),
          400: z22.object({
            message: z22.string()
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
var app = fastify().withTypeProvider();
app.register(fastifyCors, {
  origin: "*"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET
});
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "in-orbit",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
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
  const specFile = resolve(__dirname, "../../swagger.json");
  app.ready().then(() => {
    const spec = JSON.stringify(app.swagger(), null, 2);
    writeFile(specFile, spec).then(() => {
      console.log("Swagger spec generated!");
    });
  });
}
//# sourceMappingURL=server.mjs.map