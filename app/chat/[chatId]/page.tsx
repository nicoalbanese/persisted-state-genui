"use client";

import { ClientMessage } from "./actions";
import { useUIState } from "ai/rsc";
import { ChatInput } from "@/components/chat-input";

export default function Home() {
  const [conversation, _] = useUIState();

  return (
    <div className="p-4">
      <h1 className="font-semibold text-2xl my-2">Vercel Chatbot!</h1>
      <div className="space-y-4">
        {conversation.map((message: ClientMessage) => (
          <div key={message.id} className="border-t border-border pt-2">
            <div className="font-semibold uppercase text-xs text-neutral-400">
              {message.role}
            </div>
            <div>{message.display}</div>
          </div>
        ))}
      </div>
      <ChatInput />
    </div>
  );
}
