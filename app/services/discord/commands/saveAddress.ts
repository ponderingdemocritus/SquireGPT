// import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";
import { db } from "../../../server";



export = {
    data: new SlashCommandBuilder()
        .setName("address")
        .setDescription("add address to your profile")
        .addStringOption((option) =>
            option.setName("address").setDescription("Enter your StarkNet Address")
        ),
    async execute(interaction: any) {
        const address = interaction.options.getString("address");

        console.log(interaction.user.id)

        db.run('INSERT INTO users (user_id, stark_address) VALUES (?, ?)', [interaction.user.id, address], (err) => {
            if (err) {
                console.error(err);
                interaction.reply('An error occurred while storing your user ID and Stark address.');
            } else {
                interaction.reply('Your user ID and Stark address have been stored successfully.');
            }
        });

        // await interaction.reply('Pong!');

    },
};