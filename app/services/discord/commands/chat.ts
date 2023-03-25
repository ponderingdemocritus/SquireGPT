// import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";
import { blobert, ConversationAgent } from "../../../agents";

export default {
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

        const chat = new ConversationAgent(blobert);

        let embed = await chat.getResponse(question)
            .then((res: any) => {

                console.log(res)
                return {
                    title: question,
                    description: res.data
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