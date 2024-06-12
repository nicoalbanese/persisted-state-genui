"use client";
import { AI } from "@/app/chat/[chatId]/actions";
import { useUIState } from "ai/rsc";
import React from "react";

export const ChatMessages = () => {
  const [conversation, _] = useUIState<typeof AI>();

  return (
    <div className="space-y-4">
      {conversation.map((message) => message.display)}
    </div>
  );
};
