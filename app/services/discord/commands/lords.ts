import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";

const fetchFloor = async () => {
    let url = `https://api.coingecko.com/api/v3/simple/price?ids=lords&vs_currencies=USD`
    let res = await fetch(url);

    if (res.status == 404 || res.status == 400) {
        throw new Error("Error retrieving collection stats.");
    }
    if (res.status != 200) {
        throw new Error(`Couldn't retrieve metadata: ${res.statusText}`);
    }

    let data = await res.json();

    console.log(data)

    return Number(data.lords.usd);
}

export = {
    data: new SlashCommandBuilder()
        .setName("lords")
        .setDescription("Gets the latest Lords Price"),
    async execute(message: any) {
        fetchFloor()
            .then((floorPrice: any) => {
                message.channel.send(`Ser, Lords Price ${floorPrice.toFixed(3)} USD`);
            })
            .catch((error: any) => message.channel.send(error.message));
    },
};