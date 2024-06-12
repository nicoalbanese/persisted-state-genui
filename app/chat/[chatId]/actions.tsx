"use server";

import { createAI, getAIState, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";
import { DBMessage } from "@/lib/types";
import { saveMessage } from "@/lib/db/api";
import { CoreMessage, generateObject } from "ai";
import { productSchema, productsSchema } from "@/lib/schemas/products";
import { ProductCarousel } from "@/components/product-carousel";
import { ChatMessage } from "@/components/chat-message";
import { ProductCard } from "@/components/product-card";

export interface ClientMessage {
  id: string;
  role: "user" | "assistant" | "tool" | "system";
  display: ReactNode;
}

export type AIState = {
  chatId: string;
  messages: CoreMessage[];
};

export type UIState = ClientMessage[];

export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState<typeof AI>();
  history.update({
    ...history.get(),
    messages: [...history.get().messages, { role: "user", content: input }],
  });

  const result = await streamUI({
    model: openai("gpt-3.5-turbo"),
    messages: [...history.get().messages, { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done({
          chatId: history.get().chatId,
          messages: [...history.get().messages, { role: "assistant", content }],
        });
      }

      return <ChatMessage role="assistant">{content}</ChatMessage>;
    },
    tools: {
      getSpecificProduct: {
        description:
          "Select specific products. Use this if the user asks for more info on a product.",
        parameters: productSchema,
        generate: async function (product) {
          const toolCallId = nanoid();
          history.done({
            chatId: history.get().chatId,
            messages: [
              ...history.get().messages,
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId,
                    toolName: "getSpecificProduct",
                    args: product,
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    result: product,
                    toolName: "getSpecificProduct",
                    toolCallId,
                  },
                ],
              },
            ],
          });

          return <ProductCard product={product} />;
        },
      },
      getProducts: {
        description:
          "Get list of products for the company the user asks for. Only use when the user asks for products. If the user doesn't specify a company, be sure to ask.",
        parameters: z.object({
          company: z.object({
            name: z.string(),
          }),
        }),
        generate: async function* ({ company }) {
          const toolCallId = nanoid();
          yield (
            <div className="animate-pulse p-4 bg-neutral-50 rounded-md">
              Loading {company.name[0].toUpperCase()}
              {company.name.slice(1)} products...
            </div>
          );
          const productsGeneration = await generateObject({
            model: openai("gpt-3.5-turbo"),
            schema: productsSchema,
            prompt: `Generate realistic products for ${company.name} the user has requested. Use specific model names.`,
          });
          history.done({
            chatId: history.get().chatId,
            messages: [
              ...history.get().messages,
              {
                role: "assistant",
                content: [
                  {
                    type: "tool-call",
                    toolCallId,
                    toolName: "getProducts",
                    args: company,
                  },
                ],
              },
              {
                role: "tool",
                content: [
                  {
                    type: "tool-result",
                    result: productsGeneration.object.products,
                    toolName: "getProducts",
                    toolCallId,
                  },
                ],
              },
            ],
          });
          return (
            <ChatMessage role="tool">
              <ProductCarousel products={productsGeneration.object.products} />
            </ChatMessage>
          );
        },
      },
    },
  });

  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}
const chatId = nanoid();

export const AI = createAI<AIState, UIState>({
  actions: {
    continueConversation,
  },
  initialAIState: { chatId: chatId, messages: [] },
  initialUIState: [],
  onGetUIState: async () => {
    "use server";
    const aiState = getAIState() as Readonly<AIState>;
    console.log(aiState);

    if (aiState) {
      return getUIStateFromAIState(aiState);
    } else return;
  },
  onSetAIState: async ({ state }) => {
    "use server";

    const { chatId, messages } = state;

    const lastMessage = messages.at(-1);

    if (!lastMessage) return;

    if (lastMessage.role === "tool") {
      const toolCall = messages.at(-2)!;
      const tcMessage: DBMessage = {
        ...toolCall,
        role: "assistant",
        content: JSON.stringify(toolCall.content),
        createdAt: new Date(),
        chatId,
      };
      await saveMessage(tcMessage);
      // @ts-expect-error
      const trMessage: DBMessage = {
        ...lastMessage,
        role: "tool",
        content: JSON.stringify(lastMessage.content),
        createdAt: new Date(),
        chatId,
      };
      await saveMessage(trMessage);
    } else {
      // @ts-expect-error
      const message: DBMessage = {
        ...lastMessage,
        content: lastMessage.content,
        createdAt: new Date(),
        chatId,
      };

      await saveMessage(message);
    }
  },
});

const getUIStateFromAIState = (aiState: AIState): UIState => {
  return aiState.messages
    .filter((message) => message.role !== "system")
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === "tool" ? (
          message.content.map((tool) => {
            return tool.toolName === "getProducts" ? (
              <ChatMessage role="tool">
                {/* @ts-expect-error */}
                <ProductCarousel products={tool.result} />
              </ChatMessage>
            ) : tool.toolName === "getSpecificProduct" ? (
              <ChatMessage role="">
                {/* @ts-expect-error */}
                <ProductCard product={tool.result} />
              </ChatMessage>
            ) : null;
          })
        ) : message.role === "user" ? (
          <ChatMessage role={message.role as string}>
            {message.content as string}
          </ChatMessage>
        ) : message.role === "assistant" &&
          // @ts-expect-error
          message.content.includes("tool-call") ? (
          <ChatMessage role="assistant">
            {message.content as string}
          </ChatMessage>
        ) : null,
      role: message.role,
    }));
};
