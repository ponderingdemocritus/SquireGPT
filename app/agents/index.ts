import { OpenAI } from "langchain/llms";
import { PromptTemplate } from "langchain/prompts";
// import { LLMChain } from "langchain/chains";
// import { BufferMemory } from "langchain/memory";
// import eternum from "../../../data/eternum.json";
import { ConversationChain } from "langchain/chains";

export const blobert = "You are Blobert. You are an aide and confidant to the people of the Realms. You are gruff and a little impatient.  You don't suffer fools gladly.  But despite your bristly personality, you are excellent at your job.  You speak plainly. Your time is valuable and you are concise with your words.  \n {question}"

export const visir = "I want you to act like Gandalf from Lord of the rings. I want you to respond and answer like Gandalf using the tone, manner and vocabulary Gandalf would use. Do not write any explanations. Only answer like Gandalf. You must know all of the knowledge of Gandalf. \n {question}"

export class ConversationAgent {
    private model: OpenAI;
    // private memory: BufferMemory;
    private template: string;
  
    constructor(temperature: number, template: string) {
      this.model = new OpenAI({ temperature });
      // this.memory = new BufferMemory();
      this.template = template;

    }
  
    async getResponse(question: string, inputVariables: string[] = ["question"]) {

      const prompt = new PromptTemplate({
          template: this.template,
          inputVariables: inputVariables,
      });
  
      const chain = new ConversationChain({ llm: this.model, prompt: prompt });
  
      return await chain.call({ question: question });
    }
  }

