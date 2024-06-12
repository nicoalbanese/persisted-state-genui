import { date, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const chats = pgTable("chats", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
});

export const messages = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  chatId: text("chat_id").references(() => chats.id),
  content: text("content"),
  createdAt: timestamp("created_at"),
  role: text("role"),
});
