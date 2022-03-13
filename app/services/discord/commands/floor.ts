import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";
import { settings } from '../cron/helpers';

const fetchFloor = async () => {
    let url = `https://api.opensea.io/api/v1/collection/lootrealms/stats`
    let res = await fetch(url, settings);

    if (res.status == 404 || res.status == 400) {
        throw new Error("Error retrieving collection stats.");
    }
    if (res.status != 200) {
        throw new Error(`Couldn't retrieve metadata: ${res.statusText}`);
    }

    let data = await res.json();

    return Number(data.stats.floor_price);
}

export = {
    data: new SlashCommandBuilder()
        .setName("floor")
        .setDescription("Gets the Floor"),
    async execute(message: any) {
        fetchFloor()
            .then((floorPrice: any) => {
                message.channel.send(`The current floor price is ${floorPrice.toFixed(3)}Ξ`);
            })
            .catch((error: any) => message.channel.send(error.message));
    },
};