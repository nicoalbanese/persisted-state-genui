import { CoreMessage } from "ai";

export type Message = CoreMessage & {
  id: string;
};

export type DBMessage = CoreMessage & { createdAt: Date; chatId: string };
