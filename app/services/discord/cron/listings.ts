require('dotenv').config();
import fetch from 'node-fetch';
import { openSeaConfig, discordConfig } from "../../../config";
import { settings, buildMessage } from '../../utils/helpers';

var listingCache: any = [];
var lastTimestamp: any = null;

export = {
    name: 'listing',
    description: 'listing bot',
    interval: 30000,
    enabled: discordConfig.salesChannel != null,
    async execute(client: any) {

        if (lastTimestamp == null) {
            lastTimestamp = Math.floor(Date.now() / 1000) - 120;
        } else {
            lastTimestamp -= 30;
        }
        let newTimestamp = Math.floor(Date.now() / 1000) - 30;

        let next = null;
        let newEvents = true;

        do {
            let url: string = `${openSeaConfig.openseaEventsUrl}?collection_slug=lootrealms&event_type=created&only_opensea=false&occurred_before=${newTimestamp}${next == null ? '' : `&cursor=${next}`}`;
            try {
                var res = await fetch(url, settings);
                if (res.status != 200) {
                    throw new Error(`Couldn't retrieve events: ${res.statusText}`);
                }

                let data = await res.json();

                next = data.next;

                data.asset_events.forEach(async function (event: any) {

                    if (event.asset) {
                        if (listingCache.includes(event.id)) {
                            newEvents = false;
                            return;
                        } else {
                            listingCache.push(event.id);
                            if (listingCache.length > 200) listingCache.shift();
                        }

                        if ((+new Date(event.created_date) / 1000) < lastTimestamp) {
                            newEvents = false;
                            return;
                        }

                        const message = await buildMessage(event, false)

                        client.channels.fetch(discordConfig.listingsChannel)
                            .then((channel: any) => {
                                channel.send({ embeds: [message.attributes] }).then((text: any) => {

                                    for (const resource of message.resources) {
                                        console.log(resource);

                                        const emoji = client.emojis.cache.find(
                                            (emoji: any) =>
                                                emoji.name === resource.replace(" ", "")
                                        );

                                        console.log(emoji);

                                        if (emoji) {
                                            text.react(emoji);
                                        }
                                    }
                                });
                            })
                            .catch(console.error);
                    }
                });
            }
            catch (error) {
                console.error(error);
                return;
            }
        } while (next != null && newEvents)

        lastTimestamp = newTimestamp;
    }
};
