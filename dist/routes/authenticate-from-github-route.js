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

// src/routes/authenticate-from-github-route.ts
var authenticate_from_github_route_exports = {};
__export(authenticate_from_github_route_exports, {
  authenticateFromGithubRoute: () => authenticateFromGithubRoute
});
module.exports = __toCommonJS(authenticate_from_github_route_exports);
var import_zod2 = require("zod");

// src/functions/authenticate-from-github-code.ts
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
  const result = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.externalAcountId, githubUser.id));
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
var authenticateFromGithubRoute = async (app) => {
  app.post(
    "/auth/github",
    {
      schema: {
        operationId: "authenticateFromGithub",
        tags: ["auth"],
        description: "Authenticate user from Gitub code",
        body: import_zod2.z.object({
          code: import_zod2.z.string()
        }),
        response: {
          201: import_zod2.z.object({ token: import_zod2.z.string() })
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authenticateFromGithubRoute
});
