"use server";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import "dotenv/config";
import { chats, messages } from "./schema";
import { nanoid } from "nanoid";
import { eq, sql } from "drizzle-orm";
import { DBMessage } from "../types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool);

export const getChats = async () => {
  const result = await db
    .select({
      id: chats.id,
      title: sql<string>`jsonb_agg(messages.content) FILTER (WHERE messages.id IS NOT NULL) -> -1`,
    })
    .from(chats)
    .leftJoin(messages, eq(chats.id, messages.chatId))
    .groupBy(chats.id);

  return result;
};

export const getChat = async (id: string) => {
  const chatsWithMessages = await db
    .select()
    .from(chats)
    .where(eq(chats.id, id))
    .leftJoin(messages, eq(chats.id, messages.chatId));
  if (chatsWithMessages.length === 0) return null;
  const chat = {
    id: chatsWithMessages[0].chats.id,
    messages: chatsWithMessages.map((m) => m.messages),
  };
  return chat;
};

export const createChat = async () => {
  const [newChat] = await db.insert(chats).values({ id: nanoid() }).returning();
  return newChat;
};

export const saveMessage = async (message: DBMessage) => {
  // @ts-ignore
  const [newMessage] = await db.insert(messages).values(message).returning();
  return newMessage;
};
