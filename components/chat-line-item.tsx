import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const ChatLineItem = () => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="border w-8 h-8">
        <AvatarImage alt="Image" src="/placeholder-user.jpg" />
        <AvatarFallback>YO</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-medium">You</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          How do I connect my app to the API?
        </div>
      </div>
    </div>
  );
};

export default ChatLineItem;
