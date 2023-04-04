import { pinecone } from "../server";

export class ConversationAgent {
  private template: string;

  constructor(template: string) {
    this.template = template;
  }

  async getResponse(question: string) {
    const { OpenAI } = await import('langchain/llms');
    const { OpenAIEmbeddings } = await import("langchain/embeddings");
    const { PineconeStore } = await import("langchain/vectorstores");
    const { ChatVectorDBQAChain } = await import("langchain/chains");

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex: pinecone.Index(process.env.PINECONE_INDEX || ""), namespace: process.env.PINECONE_NAMESPACE },
    );

    const model = new OpenAI({ modelName: process.env.OPENAI_MODEL });

    const chain = ChatVectorDBQAChain.fromLLM(model, vectorStore, {
      returnSourceDocuments: true,
      qaTemplate: this.template,
    });

    const response = await chain.call({
      question: question,
      chat_history: []
    });

    return response.text
  }

  async getResponseWithoutContext(question: string) {

    const { OpenAI } = await import('langchain/llms');
    const { ConversationChain } = await import("langchain/chains");

    const model = new OpenAI({ modelName: process.env.OPENAI_MODEL });

    const chain = new ConversationChain({ llm: model });

    const input = this.template + question
    const response = await chain.call({
      input
    });

    return response.response
  }
}