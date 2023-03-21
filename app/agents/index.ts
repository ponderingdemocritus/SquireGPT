import { pinecone } from "../server";
import { DataSource } from "typeorm";

export const blobert = "You are Blobert. You are an aide and confidant to the people of the Realms. You are gruff and a little impatient.  You don't suffer fools gladly.  But despite your bristly personality, you are excellent at your job.  You speak plainly. Your time is valuable and you are concise with your words. Answer this:"

export const visir = "I want you to act like Gandalf from Lord of the rings. I want you to respond and answer like Gandalf using the tone, manner and vocabulary Gandalf would use. Do not write any explanations. Only answer like Gandalf. You must know all of the knowledge of Gandalf. \n {question}"

export class ConversationAgent {

  private template: string;

  constructor(template: string) {

    // this.memory = new BufferMemory();
    this.template = template;

  }

  async getResponse(question: string) {

    console.log("question", question);
    console.log("template", this.template);
    const { OpenAIChat } = await import('langchain/llms');
    const { OpenAIEmbeddings } = await import("langchain/embeddings");
    const { PineconeStore } = await import("langchain/vectorstores");
    const { VectorDBQAChain } = await import("langchain/chains");

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings(),
      { pineconeIndex: pinecone.Index("realms"), namespace: 'demo' },
    );

    const model = new OpenAIChat({ modelName: "gpt-4" });

    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
      returnSourceDocuments: true,
    });

    const response = await chain.call({
      query: this.template + question,
    });

    return response.text
  }
}

export const sqlRun = async () => {
  const { SqlDatabase } = await import("langchain/sql_db");
  const { SqlDatabaseChain } = await import("langchain/chains");
  const { OpenAI } = await import('langchain');

  const datasource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: 25060,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: true,
  });

  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });

  const chain = new SqlDatabaseChain({
    llm: new OpenAI({ temperature: 1 }),
    database: db,
  });

  const res = await chain.run("Get the name of Realm id 1");
  console.log(res);

  await datasource.destroy();
};

