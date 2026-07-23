import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const skillCategory = pgEnum("skill_category", [
  "languages",
  "frameworks",
  "libraries",
  "tools",
]);

export const experiences = pgTable("experiences", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyName: text("company_name").notNull(),
  positionName: text("position_name").notNull(),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date"),
  summary: text("summary").notNull(),
  responsibilities: jsonb("responsibilities")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  photos: jsonb("photos").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  mainVideo: text("main_video"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date"),
  summary: text("summary").notNull(),
  whatIDid: text("what_i_did").notNull(),
  photos: jsonb("photos").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  mainVideo: text("main_video"),
  projectLink: text("project_link"),
  toolsUsed: jsonb("tools_used")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const blogs = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  photos: jsonb("photos").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  content: text("content").notNull(),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  photo: text("photo").notNull(),
  name: text("name").notNull(),
  category: skillCategory("category").notNull(),
});

export const endorsements = pgTable("endorsements", {
  id: uuid("id").defaultRandom().primaryKey(),
  experienceId: uuid("experience_id")
    .notNull()
    .references(() => experiences.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  note: text("note").notNull(),
  approved: boolean("approved").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
