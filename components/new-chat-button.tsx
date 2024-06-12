"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { nanoid } from "nanoid";

export const NewChatButton = () => {
  const router = useRouter();
  return (
    <Button
      variant={"outline"}
      onClick={() => router.push("/chat/" + nanoid())}
    >
      New Chat
    </Button>
  );
};
