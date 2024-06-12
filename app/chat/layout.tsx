import { AI } from "./[chatId]/actions";
import { ChatInterface } from "@/components/chat-interface";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AI>
      <ChatInterface>{children}</ChatInterface>
    </AI>
  );
}
