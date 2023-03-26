// import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";
import { blobertWithoutContext, ConversationAgent } from "../../../agents";
import { client } from  "../index"

export default {
    data: new SlashCommandBuilder()
        .setName("rumors")
        .setDescription("Blobert will tell you about the latest rumors on the channel")
        .addStringOption((option) =>
            option.setName("question")
                .setDescription("Default: last summarized rumors of this channel")),
    async execute(interaction: any) {
        const channelId = interaction.channelId
        const channelName = interaction.channel.name
        const username = interaction.user.username
        const discordServerName = interaction.guild.name
        const question = interaction.options.getString("question") || "Please provide a summary of what was discussed and what happened in the channel";

        await interaction.deferReply();

        const chat = new ConversationAgent(blobertWithoutContext.replace("<USERNAME>", username));

        const channel = await client.channels.fetch(channelId) as any;
        const messages = await channel.messages.fetch({ limit: 100 });
        let prompt = `Here is a list of last 100 chat messages of ${channelName} channel on ${discordServerName} discord server, rely on them in your answer. Please dont mention that your answer is based on this chat messages, just act like you knew all the rumors about what was going on. Please avoid using the phrase 'Based on the chat history provided' in your response.. Messages List:\n`
        for (const [id, message] of messages) {
            id
            prompt += `"${message.author.username}: ${message.content}"\n`
        }
        if (question) {
            prompt += "\n"+question
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