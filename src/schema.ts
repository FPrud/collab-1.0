import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, integer, serial, date } from "drizzle-orm/pg-core";

//tables BetterAuth
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    isAdmin: boolean("is_admin").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

// Tables Collab
export const profiles = pgTable("profiles", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    address: text("address"),
    birthdate: date("birthdate"),
    bio: text("bio"),
    contactLink: text("contact_link")
});

export const posts = pgTable("posts", {
    id: serial('id').primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    postActiveStatus: boolean("post_active_status").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});

export const userFavoritePosts = pgTable("user_favorite_posts", {
  id: serial('id').primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
});

export const musicSkills = pgTable("music_skills", {
    id: serial('id').primaryKey(),
    skillName: text("skill_name").notNull(),
});

export const musicGenres = pgTable("music_genres", {
    id: serial('id').primaryKey(),
    genreName: text("genre_name").notNull()
});

export const userSkills = pgTable("user_skills", {
    id: serial('id').primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    skillId: integer("skill_id").notNull().references(() => musicSkills.id, { onDelete: "cascade" }),
    genreId: integer("genre_id").references(() => musicGenres.id, { onDelete: "cascade" })
});

export const searchedSkills = pgTable("searched_skills", {
    id: serial('id').primaryKey(),
    postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
    skillId: integer("skill_id").notNull().references(() => musicSkills.id, { onDelete: "cascade" }),
    genreId: integer("genre_id").references(() => musicGenres.id, { onDelete: "cascade" })
});

export const comments = pgTable("comments", {
  id: serial('id').primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  commentActiveStatus: boolean("comment_active_status").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});

export const musicalInfluences = pgTable("musical_influences", {
  id: serial('id').primaryKey(),
  artistName: text("artist_name").notNull(),
  releaseName: text("release_name").notNull(),
  releaseYear: integer("release_year").notNull()
});

export const userMusicalInfluences = pgTable("user_musical_influences", {
  id: serial('id').primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  influenceId: integer("influence_id").notNull().references(() => musicalInfluences.id, { onDelete: "cascade" }),
});

export const equipments = pgTable("equipments", {
  id: serial('id').primaryKey(),
  equipmentType: text("equipment_type").notNull(),
  brandName: text("brand_name"),
  modelName: text("model_name")
});

export const userEquipments = pgTable("user_equipments", {
  id: serial('id').primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  equipmentId: integer("equipment_id").notNull().references(() => equipments.id, { onDelete: "cascade" })
});
