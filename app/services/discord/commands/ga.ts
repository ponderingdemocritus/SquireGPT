import { SlashCommandBuilder } from "@discordjs/builders";
import { request } from "graphql-request";
import { getGA } from '../../graphql'
import sharp from 'sharp';

const fetchRealm = async (id: number) => {

    const variables = {
        id: id.toString(),
    };

    const { adventurers } = await request(
        "https://api.thegraph.com/subgraphs/name/treppers/genesisproject",
        getGA,
        variables
    );

    const metadata = adventurers[0].tokenURI.split(",")[1]

    let buff: any = new Buffer(metadata, 'base64');
    let jsonMega = JSON.parse(buff)

    let imageBase64 = jsonMega.image.split(",")[1]

    let image: any = new Buffer(imageBase64, 'base64');
    let img = await sharp(image);

    return {
        img: img,
        attributes: {
            title: "GA",
        }
    }
};

export = {
    data: new SlashCommandBuilder()
        .setName("ga")
        .setDescription("Replies with your GA details")
        .addIntegerOption((option) =>
            option.setName("int").setDescription("Enter Realm Id")
        ),
    async execute(interaction: any) {
        const integer = interaction.options.getInteger("int");
        const res = await fetchRealm(integer);
        await interaction.reply({
            embeds: [res.attributes],
            files: [res.img],
            fetchReply: true,
        });
    },
};
