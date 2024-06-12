"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { nanoid } from "nanoid";
import { createChat } from "@/lib/db/api";

export const NewChatButton = () => {
  const router = useRouter();
  return (
    <Button
      variant={"outline"}
      onClick={async () => {
        const { id } = await createChat();
        router.push("/chat/" + id);
      }}
    >
      New Chat
    </Button>
  );
};
