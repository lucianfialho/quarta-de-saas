import {
  pgTable,
  pgSchema,
  text,
  timestamp,
  pgEnum,
  uuid,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// --- Neon Auth schema reference ---

const neonAuth = pgSchema("neon_auth");

export const userInNeonAuth = neonAuth.table(
  "user",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    emailVerified: boolean().notNull(),
    image: text(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [unique("user_email_key").on(table.email)]
);

// --- Application tables ---

export const stageEnum = pgEnum("stage", [
  "idea",
  "mvp",
  "launched",
  "traction",
]);

export const pitches = pgTable("pitches", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userInNeonAuth.id),
  saasName: text("saas_name").notNull(),
  url: text("url"),
  tagline: text("tagline").notNull(),
  stage: stageEnum("stage").notNull().default("idea"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
