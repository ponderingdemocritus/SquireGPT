// import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";
import { blobertWithoutContext, ConversationAgent } from "../../../agents";
import { client } from  "../index"

export default {
    data: new SlashCommandBuilder()
        .setName("rumors")
        .setDescription("Blobert will tell you about the latest rumors on the channel"),
    async execute(interaction: any) {
        const channelId = interaction.channelId
        const channelName = interaction.channel.name
        const username = interaction.user.username

        await interaction.deferReply();

        const chat = new ConversationAgent(blobertWithoutContext.replace("<USERNAME>", username));

        const channel = await client.channels.fetch(channelId) as any;
        const messages = await channel.messages.fetch({ limit: 100 });
        let prompt = "Here is a list of recent chat messages, please analyze them and provide a summary of what was discussed and what happened in the channel. Please dont mention that your answer is based on the chat messages, just act like you knew all the rumors about what was going on. Chat Messages List:\n"
        for (const [id, message] of messages) {
            id
            prompt += `${message.author.username}: ${message.content}\n`
        }
        
        let embed = await chat.getResponseWithoutContext(prompt)
            .then((res: any) => {

                return {
                    title: `Rumors of ${channelName}.`,
                    description: res
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