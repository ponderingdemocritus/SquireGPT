import { OpenAI } from "langchain/llms";
import { PromptTemplate } from "langchain/prompts";
// import { LLMChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
// import eternum from "../../../data/eternum.json";
import { ConversationChain } from "langchain/chains";

const blobertMemory = new BufferMemory();

export const getBlobert = async (question: string) => {
    const model = new OpenAI({ temperature: 0.9 });

    const template = "You are Blobert. You are an aide and confidant to the people of the Realms. You are gruff and a little impatient.  You don't suffer fools gladly.  But despite your bristly personality, you are excellent at your job.  You speak plainly. Your time is valuable and you are concise with your words. Answer this question with attitude and in an old english accent: \n {question}";
    
    const prompt = new PromptTemplate({
        template: template,
        inputVariables: ["question"],
    });

    const chain = new ConversationChain({ llm: model, memory: blobertMemory, prompt: prompt });

    const res = await chain.call({ question: question });
    
    return res;
}

const vizir = new BufferMemory();

export const getVizir = async (question: string) => {
    const model = new OpenAI({ temperature: 0.9 });

    const template = "You are an Advisor to the King, you are able to answer any question that you are ask. Response with proper manners. Answer this question: \n {question}";
    
    const prompt = new PromptTemplate({
        template: template,
        inputVariables: ["question"],
    });

    const chain = new ConversationChain({ llm: model, memory: vizir, prompt: prompt });

    const res = await chain.call({ question: question });
    
    return res;
}