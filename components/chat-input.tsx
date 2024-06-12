"use client";

import { Button } from "./ui/button";
import { useActions, useUIState } from "ai/rsc";
import { ClientMessage } from "@/app/chat/[chatId]/actions";
import { nanoid } from "nanoid";
import { useState } from "react";
import { Input } from "./ui/input";
import { ChatMessage } from "./chat-message";

export const ChatInput = () => {
  const [input, setInput] = useState<string>("");

  const [_, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div className="sticky bottom-0 bg-white dark:bg-gray-950 py-4 mt-4 border-t border-gray-200 dark:border-gray-800">
      <form
        className="relative"
        onSubmit={async (e) => {
          e.preventDefault();
          setInput("");
          setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            {
              id: nanoid(),
              role: "user",
              display: <ChatMessage role="user">{input}</ChatMessage>,
            },
          ]);

          const message = await continueConversation(input);

          setConversation((currentConversation: ClientMessage[]) => [
            ...currentConversation,
            message,
          ]);
        }}
      >
        <Input
          className="min-h-[48px] rounded-2xl resize-none p-4 border border-gray-200 shadow-sm pr-16 dark:border-gray-800"
          id="message"
          name="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button
          className="absolute top-3 right-3 w-8 h-8"
          size="icon"
          type="submit"
        >
          <ArrowUpIcon className="w-4 h-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
};

function ArrowUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}
