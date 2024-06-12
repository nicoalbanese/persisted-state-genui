import { ChatInterface } from "@/components/chat-interface";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ChatInterface>{children}</ChatInterface>;
}
