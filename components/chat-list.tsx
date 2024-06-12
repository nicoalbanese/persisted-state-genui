import { getChats } from "@/lib/db/api";
import { NewChatButton } from "./new-chat-button";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";

export const ChatList = async () => {
  const chats = await getChats();
  return (
    <div className="flex flex-col space-y-4">
      <NewChatButton />
      {chats.map((c, i) => (
        <Link
          key={i}
          href={"/chat/" + c.id}
          className="flex items-center gap-3"
        >
          <Avatar className="border w-8 h-8">
            <AvatarImage alt="Image" src="/placeholder-user.jpg" />
          </Avatar>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {c.title?.length > 0 ? c.title.slice(0, 20) : "New chat"}...
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
