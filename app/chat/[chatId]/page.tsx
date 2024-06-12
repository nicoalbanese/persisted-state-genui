import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { AI } from "./actions";
import { getChat } from "@/lib/db/api";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: { chatId: string } }) {
  const chat = await getChat(params.chatId);
  if (chat === null) notFound();
  return (
    <AI
      initialAIState={{
        chatId: params.chatId,
        // @ts-expect-error
        messages: chat.messages
          .filter((m) => m !== null)
          .map((m) => {
            console.log(m);
            return {
              content: m?.content?.includes("tool-")
                ? JSON.parse(m?.content)
                : m?.content,
              role: m?.role,
            };
          }),
      }}
    >
      <div className="p-4">
        <h1 className="font-semibold text-2xl my-2">Vercel Chatbot!</h1>
        <ChatMessages />
        <ChatInput />
      </div>
    </AI>
  );
}
