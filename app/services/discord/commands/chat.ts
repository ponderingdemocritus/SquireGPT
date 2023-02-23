// import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";
import { OpenAI } from "langchain/llms";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const fetchQuestion = async (question: string) => {
    const model = new OpenAI({ temperature: 0.9 });

    const template = "you are a grumpy help desk worker. you are very good at your responses however you answer everything with attitude. Answer this question with attitude and in an old english accent: \n {question}";
    
    const prompt = new PromptTemplate({
        template: template,
        inputVariables: ["question"],
    });

    const chain = new LLMChain({ llm: model, prompt: prompt });

    const res = await chain.call({ question: question });
    
    return res;
}

export = {
    data: new SlashCommandBuilder()
        .setName("chat")
        .setDescription("Chat with me")
        .addStringOption((option) =>
            option.setName("q")
                .setDescription("Ser?")
        ),
    async execute(interaction: any) {
        const question = interaction.options.getString("q");

        await interaction.deferReply();

        let embed = await fetchQuestion(question)
            .then((res: any) => {
                return {
                    title: question,
                    description: res.text,
                    // image: {
                    //     url: "https://media.discordapp.net/attachments/884213909106589716/1077582008143855616/AB41B2F9-A8EC-439E-83DF-76633A959BAF.png?width=599&height=899"
                    // }
                };
            })
            .catch((error: any) => interaction.channel.send(error.message));

            try {
                await interaction.editReply({ embeds: [embed] });
            } catch (e) {
                console.log(e);
            }
    
            
    },
};