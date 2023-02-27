// import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";
import { ConversationAgent, visir } from "../../../agents";

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

        const chat = new ConversationAgent(0.9, visir);

        let embed = await chat.getResponse(question)
            .then((res: any) => {
                return {
                    title: question,
                    description: res.response
                };
            })
            .catch((error: any) => console.log(error));
            

            try {
                await interaction.editReply({ embeds: [embed] });
            } catch (e) {
                console.log(e);
            }
    },
};