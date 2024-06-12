import ChatLineItem from "./chat-line-item";
import { NewChatButton } from "./new-chat-button";

export const ChatList = async () => {
  return (
    <div className="flex flex-col space-y-4">
      <NewChatButton />
      <ChatLineItem />
    </div>
  );
};
