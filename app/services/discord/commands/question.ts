import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";

const fetchQuestion = async (question: string) => {
    let url = `https://bot-production-da53.up.railway.app/docs/question`
    let res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            question: question.toString()
        }),
    });

    if (res.status == 404 || res.status == 400) {
        throw new Error("Error retrieving collection stats.");
    }
    if (res.status != 200) {
        throw new Error(`Couldn't retrieve metadata: ${res.statusText}`);
    }
    let data = await res.json();

    return data;
}

const questionCommand = {
    data: new SlashCommandBuilder()
        .setName("question")
        .setDescription("Asks a Question")
        .addStringOption((option) =>
            option.setName("q")
                .setDescription("What is your question?")
        ),
    async execute(interaction: any) {
        const question = interaction.options.getString("q");

        await fetchQuestion(question)
            .then((res: any) => {
                const embed = {
                    title: question,
                    description: res.item_id,
                    fields: [{ name: "please note:", value: 'This is a bot generated response...', inline: true }],
                    url: "https://scroll.bibliothecadao.xyz"
                };
                interaction.channel.send({ embeds: [embed] });
            })
            .catch((error: any) => interaction.channel.send(error.message));
    },
};

export default questionCommand;