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
                .setDescription("Default: Blobert will tell you about the latest rumors on the channel")),
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
        let history = ''
        for (const [id, message] of messages) {
            id
            if (!message.content && message.embeds.length > 0) {
                message.embeds.forEach((embed: any) => {
                    if (embed.data.title && embed.data.description) {
                        history += `"${message.author.username} Bot Response: {${embed.data.title} - ${embed.data.description}}"\n`
                    }
                })
            } else {
                history += `"${message.author.username}: ${message.content}"\n`
            }
        }
        // clamp history to last 1000 symbols
        if (history.length > 1000) {
            history = history.slice(-1000)
         }
        if (question) {
            prompt += history + "\n\n"+question
        }
        let embed = await chat.getResponseWithoutContext(prompt)
            .then((res: any) => {

                return {
                    title: interaction.options.getString("question") ? question : `Rumors of ${channelName}.`,
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