require('dotenv').config();
import fetch from 'node-fetch';
import Discord from 'discord.js';
import { openSeaConfig } from "../../../config";
import checkRealmRarity from '../../utils/useRarity'

var salesCache: any = [];
var lastTimestamp: any = null;

export = {
    name: 'sales',
    description: 'sales bot',
    interval: 30000,
    enabled: process.env.DISCORD_SALES_CHANNEL_ID != null,
    async execute(client: any) {
        if (lastTimestamp == null) {
            lastTimestamp = Math.floor(Date.now() / 1000) - 120;
        } else {
            lastTimestamp -= 30;
        }
        let newTimestamp = Math.floor(Date.now() / 1000) - 30;
        // we're retrieving events from -90 to -30 seconds ago each time, and each query overlaps the previous query by 30 seconds
        // doing this to try to resolve some intermittent issues with events being missed by the bot, suspect it's due to OpenSea api being slow to update the events data
        // duplicate events are filtered out by the salesCache array

        let settings: any = {
            method: "GET",
            headers: process.env.OPEN_SEA_API_KEY == null ? {} : {
                "X-API-KEY": process.env.OPEN_SEA_API_KEY
            }
        };
        while (1) {
            let url = `${openSeaConfig.openseaEventsUrl}?collection_slug=lootrealms&event_type=successful&only_opensea=false&limit=50&occurred_before=${newTimestamp}`;

            try {
                var res = await fetch(url, settings);
                if (res.status != 200) {
                    throw new Error(`Couldn't retrieve events: ${res.statusText}`);
                }

                let data = await res.json();
                if (data.asset_events.length == 0) {
                    break;
                }

                data.asset_events.forEach(async function (event: any) {
                    if (event.asset) {
                        if (salesCache.includes(event.id)) {
                            return;
                        } else {
                            salesCache.push(event.id);
                            if (salesCache.length > 200) salesCache.shift();
                        }

                        const embedMsg = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle(event.asset.name)
                            .setURL(event.asset.permalink)
                            .setDescription(`has just been sold for ${event.total_price / (1e18)}\u039E`)
                            .setThumbnail(event.asset.image_url)
                            .addField("From", `[${event.seller.user?.username || event.seller.address.slice(0, 8)}](https://etherscan.io/address/${event.seller.address})`, true)
                            .addField("To", `[${event.winner_account.user?.username || event.winner_account.address.slice(0, 8)}](https://etherscan.io/address/${event.winner_account.address})`, true);


                        let openSeaResponseUrl = `${openSeaConfig.openseaAssetUrl}/${process.env.CONTRACT_ADDRESS}/${event.asset.token_id}`;

                        try {
                            var res = await fetch(openSeaResponseUrl, settings);
                            if (res.status != 200) {
                                throw new Error(`Couldn't retrieve events: ${res.statusText}`);
                            }

                            let data = await res.json();
                            console.log(data)

                            const rarity = checkRealmRarity(data.traits).toFixed(2)

                            const resources = data.traits.filter((resource: any) => resource.trait_type === 'Resource').map((a: any) => a.value);

                            const cities = data.traits.find((resource: any) => resource.trait_type === 'Cities')
                            const harbors = data.traits.find((resource: any) => resource.trait_type === 'Harbors')
                            const regions = data.traits.find((resource: any) => resource.trait_type === 'Regions')
                            const rivers = data.traits.find((resource: any) => resource.trait_type === 'Rivers')
                            const order = data.traits.find((resource: any) => resource.trait_type === 'Order')
                            const wonder = data.traits.find((resource: any) => resource.trait_type === 'Wonder (translated)')

                            embedMsg.addField('Order', order.value, true)
                            embedMsg.addField('Rarity', rarity, true)
                            embedMsg.addField('Resources', resources, true)
                            embedMsg.addField('Traits', `Cities ${cities.value}/21\n Regions ${regions.value}/7\n Harbors ${harbors.value}/35\n Rivers ${rivers.value}/60\n`, true)
                            if (wonder) {
                                embedMsg.addField('Wonder', wonder.value, true)
                            }
                        } catch (e) {
                            console.log(e)
                        }

                        client.channels.fetch(process.env.DISCORD_SALES_CHANNEL_ID)
                            .then((channel: any) => {
                                channel.send(embedMsg);
                            })
                            .catch(console.error);
                    }
                });
            }
            catch (error) {
                console.error(error);
                return;
            }
        }

        lastTimestamp = newTimestamp;
    }
};
