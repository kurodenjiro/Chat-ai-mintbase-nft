"use server"
import { StreamingTextResponse } from "ai";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { createRetrieverTool } from "langchain/tools/retriever";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { ChatOpenAI } from "@langchain/openai";
import path from "path";

// @ts-ignore  
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";


const isProduction = process.env.NODE_ENV === "production";
export async function POST(req: Request) {
    const dir = path.resolve("../admin", "public", dirRelativeToPublicFolder); // 
   // console.log(__dirname);
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


  const llm = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0 });
  const body = await req.json();
  const { messages } = body;
  
  const vectorStore = await HNSWLib.load(
    "/public/hnswlib",
    new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
  );

  const retriever = vectorStore.asRetriever();
  const tool = await createRetrieverTool(retriever, {
      name: "near_nft_mainnet",
      description: "Searches contract address and returns NFT general information.",
  });

  const tools = [tool];
  const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are very powerful assistant, but don't know current events"],
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const agent = await createOpenAIToolsAgent({
      llm,
      tools,
      prompt,
  });
  const agentExecutor = new AgentExecutor({
      agent,
      tools
  });
  const result = await agentExecutor.invoke({
      input: messages
  });
  console.log(result.output)
  

  return new StreamingTextResponse(result.output as any);
}
