// import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";
import { getBlobert } from "../../../agents";

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

        let embed = await getBlobert(question)
            .then((res: any) => {
                return {
                    title: question,
                    description: res.response
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