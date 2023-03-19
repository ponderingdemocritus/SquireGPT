import { DataSource } from "typeorm";
import docs from "../db/data/output.json";

export const blobert = "You are Blobert. You are an aide and confidant to the people of the Realms. You are gruff and a little impatient.  You don't suffer fools gladly.  But despite your bristly personality, you are excellent at your job.  You speak plainly. Your time is valuable and you are concise with your words. Answer this:"

export const visir = "I want you to act like Gandalf from Lord of the rings. I want you to respond and answer like Gandalf using the tone, manner and vocabulary Gandalf would use. Do not write any explanations. Only answer like Gandalf. You must know all of the knowledge of Gandalf. \n {question}"

export class ConversationAgent {

  private template: string;

  constructor(template: string) {

    // this.memory = new BufferMemory();
    this.template = template;

  }

  async getResponse(question: string) {
    // const { LLMChain } = await import("langchain");
    const { OpenAIChat } = await import('langchain/llms');

    // const { Chroma } = await import("langchain/vectorstores");
    const { OpenAIEmbeddings } = await import("langchain/embeddings");
    const { HNSWLib } = await import("langchain/vectorstores");

    const { ChatVectorDBQAChain } = await import("langchain/chains");

    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    
    


    // const resultOne = await vectorStore.similaritySearch("scared", 2);
    // console.log(resultOne); // -> 'Achilles: Yiikes! What is that?'

    // const { ChatPromptTemplate,
    //   SystemMessagePromptTemplate,
    //   HumanMessagePromptTemplate, } = await import("langchain/prompts");

    const model = new OpenAIChat({ temperature: 0.8, modelName: "gpt-4" });

    // const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    //   SystemMessagePromptTemplate.fromTemplate(
    //     this.template
    //   ),
    //   HumanMessagePromptTemplate.fromTemplate("{text}"),
    // ]);

    console.log(this.template)
    const chain = ChatVectorDBQAChain.fromLLM(model, vectorStore);

    const response = await chain.call({ question: blobert + question, chat_history: [] });

    // console.log(res);

    // const chain = new LLMChain({
    //   prompt: chatPrompt,
    //   llm: chat,
    // });

    // const response = await chain.call({
    //   text: question,
    // });



    // const prompt = new PromptTemplate({
    //   template: this.template,
    //   inputVariables: inputVariables,
    // });

    // const chain = new ConversationChain({ llm: model, prompt: prompt });

    // const r = await executor.run(question);

    console.log(response.text);

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

