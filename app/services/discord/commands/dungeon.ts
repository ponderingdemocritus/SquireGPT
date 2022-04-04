
import { SlashCommandBuilder } from "@discordjs/builders";
import { request } from "graphql-request";
import { getCNC } from '../../utils/graphql'
import sharp from 'sharp';

const fetchCNC = async (id: number) => {

    const variables = {
        id: id.toString(),
    };

    const { dungeons } = await request(
        "https://api.thegraph.com/subgraphs/name/redbeardeth/lootdev",
        getCNC,
        variables
    );

    const metadata = dungeons[0];
    let image: any = Buffer.from(metadata.svg);
    let img = await sharp(image);

    return {
        img: img
    }
};

export = {
    data: new SlashCommandBuilder()
        .setName("dungeon")
        .setDescription("Replies with your Crypts and Caverns dungeon details")
        .addIntegerOption((option) =>
            option.setName("int").setDescription("Enter dungeon Id")
        ),
    async execute(interaction: any) {
        const integer = interaction.options.getInteger("int");
        const res = await fetchCNC(integer);
        await interaction.reply({
            files: [res.img],
            fetchReply: true,
        });
    },
};
