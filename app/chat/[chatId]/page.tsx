"use client";

import { useState } from "react";
import { ClientMessage } from "./actions";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div className="max-w-xl mx-auto space-y-4">
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

      <div className="">
        <form
          className="flex"
          onSubmit={async (e) => {
            e.preventDefault();
            setInput("");
            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              { id: nanoid(), role: "user", display: input },
            ]);

            const message = await continueConversation(input);

            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              message,
            ]);
          }}
        >
          <Input
            autoFocus
            placeholder="Say hello!"
            type="text"
            className="min-w-48"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
          <Button>Send Message</Button>
        </form>
      </div>
    </div>
  );
}
