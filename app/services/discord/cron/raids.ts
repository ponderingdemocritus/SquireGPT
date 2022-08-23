require("dotenv").config();
import fetch from "node-fetch";
import { biblioConfig, discordConfig } from "../../../config";
import { formatFixed } from "@ethersproject/bignumber";
// import { history } from "../../../services/utils/testing/responses";
import { MessageActionRow, MessageButton } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
const formatEther = (value: string) => formatFixed(value, 18);

const buildRaidMessage = (raid: any) => {

  let title;
  let description = "";
  let pillagedItems: string[] = [];
  let fields = [];

  fields.push({
    name: `ATTACKER`,
    value: `${raid.data.attackRealmId}`,
    inline: false,
  }, {
    name: `DEFENDER`,
    value: `${raid.realmName} - ${raid.realmId}`,
    inline: false,
  })

  if (!raid.data.success) {
    title = 'Raid Success!'
    description = `${raid.realmName} [${raid.realmId}] of the order ${raid.realmOrder} was pillaged by ${raid.data.attackRealmOwner}`;
    if (raid.data.relicLost) {
      fields.push({
        name: `Relic ${raid.data.relicLost} stolen!`,
        value: "\u200b",
        inline: false,
      })
    }
  } else {
    title = 'Raid Failure!'
    description = `${raid.realmName} [${raid.realmId}] of the order ${raid.realmOrder} was attacked by ${raid.data.attackRealmOwner} but failed...`;
  }


  pillagedItems = raid.data.pillagedResources.map((resource: any) => {
    return `${formatEther(resource.amount)} ${resource.resourceName}`;
  });

  const pillagedItemsLen = pillagedItems.length;

  if (pillagedItemsLen === 0) {
    // description = "No resources were pillaged";
  }
  // description = `${pillagedItems[0]} was pillaged`;
  else {
    raid.data.pillagedResources.forEach((resource: any) => {
      fields.push({
        name: `${formatEther(resource.amount)} ${resource.resourceName} pillaged!`,
        value: "\u200b",
        inline: false,
      })
    })
  }

  const resourceString = raid.data.pillagedResources
    .map((a: any) => {
      return a.resourceName;
    })


  return {
    resources: resourceString,
    attributes: {
      title: title,
      description: description,
      image: {
        url: `https://ingave-images.s3.eu-west-3.amazonaws.com/37a7186b-307244_0017_0005.png`,
      },
      thumbnail: {
        url: `https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${raid.realmId}.webp`,
      },
      fields: fields,
      url: `${biblioConfig.atlasBaseUrl}/realm/${raid.realmId}?tab=History`,
    }
  };
};

// const buildRaidMessage = (raid: any) => {
//   let title;
//   let description = "";
//   let pillagedItems: string[] = [];
//   if (raid.data.success) {
//     title = `${raid.realmName} successfully defended an attack by ${raid.data.attackRealmOwner}`;
//   } else {
//     title = `${raid.realmName} was attacked by ${raid.data.attackRealmOwner}`;
//   }

//   pillagedItems = raid.data.pillagedResources.map((resource: any) => {
//     return `${formatEther(resource.amount)} ${resource.resourceName}`;
//   });

//   if (raid.data.relicLost) {
//     pillagedItems.push(`Relic ${raid.data.relicLost}`);
//   }

//   const pillagedItemsLen = pillagedItems.length;
//   if (pillagedItemsLen === 0) {
//     description = "No resources were pillaged";
//   } else if (pillagedItems.length === 1) {
//     description = `${pillagedItems[0]} was pillaged`;
//   } else {
//     description = `${pillagedItems
//       .slice(0, pillagedItemsLen - 1)
//       .join(", ")} and ${pillagedItems[pillagedItemsLen - 1]} were pillaged`;
//   }

//   return new MessageEmbed()
//     .setTitle(title)
//     .setDescription(description)
//     .setURL(`${biblioConfig.atlasBaseUrl}/realm/${raid.realmId}?tab=History`)
//     .setThumbnail(`${biblioConfig.atlasBaseUrl}/siege-tablet.png`)
//     .setTimestamp(raid.timestamp);
// };

const fetchRealmHistory = async (timestamp: number) => {
  try {
    const response = await fetch(biblioConfig.indexerUrl, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationName: "getRealmHistory",
        query: `
            query getRealmHistory {
                history: getRealmHistory( 
                    filter: { 
                        eventType: { equals:"realm_combat_defend" }, 
                        timestamp: { gt: ${timestamp} }
                    }) 
                {
                    eventId
                    realmId
                    realmOwner
                    realmOrder
                    realmName
                    eventType
                    data
                    timestamp
                }
            }
        `
      })
    });
    const results = await response.json();
    return results.data.history;
  } catch (e) {
    console.error(e);
    return null;
  }
};

let lastTimestamp = new Date().getTime();

export = {
  name: "raid",
  description: "raid bot",
  interval: 10000,
  enabled: discordConfig.raidsChannel != null,
  async execute(client: any) {
    try {
      const raids = await fetchRealmHistory(lastTimestamp);

      if (raids && raids.length) {

        raids.forEach((element: any) => {

          const message = buildRaidMessage(element)

          const row = new MessageActionRow()
            .addComponents(
              new MessageButton()

                .setLabel('See Realm')
                .setURL(message.attributes.url)
                .setStyle(MessageButtonStyles.LINK),
            );

          client.channels
            .fetch(discordConfig.raidsChannel)
            .then((channel: any) => {
              channel.send({
                embeds: [message.attributes], components: [row]
              });
              lastTimestamp = raids[0].timestamp;
            }).then((text: any) => {

              for (const resource of message.resources) {
                const emoji = client.emojis.cache.find(
                  (emoji: any) =>
                    emoji.name === resource.replace(" ", "")
                );
                if (emoji) {
                  text.react(emoji);
                }
              }
            })
            .catch((e: any) => {
              console.error(
                `Error sending raid message at timestamp ${lastTimestamp}`,
                e
              );
            });
        });

      }
    } catch (e) {
      console.error(
        `Error sending raid message at timestamp ${lastTimestamp}`,
        e
      );
    }
  }
};
