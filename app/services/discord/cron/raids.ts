require("dotenv").config();
import fetch from "node-fetch";
import { biblioConfig, discordConfig } from "../../../config";
import { MessageEmbed } from "discord.js";
import { formatFixed } from "@ethersproject/bignumber";

const formatEther = (value: string) => formatFixed(value, 18);

const buildRaidMessage = (raid: any) => {
  let title;
  let description = "";
  let pillagedItems: string[] = [];
  if (raid.data.success) {
    title = `${raid.realmName} successfully defended an attack by ${raid.data.attackRealmOwner}`;
  } else {
    title = `${raid.realmName} was attacked by ${raid.data.attackRealmOwner}`;
  }

  pillagedItems = raid.data.pillagedResources.map((resource: any) => {
    return `${formatEther(resource.amount)} ${resource.resourceName}`;
  });

  if (raid.data.relicLost) {
    pillagedItems.push(`Relic ${raid.data.relicLost}`);
  }

  const pillagedItemsLen = pillagedItems.length;
  if (pillagedItemsLen === 0) {
    description = "No resources were pillaged";
  } else if (pillagedItems.length === 1) {
    description = `${pillagedItems[0]} was pillaged`;
  } else {
    description = `${pillagedItems
      .slice(0, pillagedItemsLen - 1)
      .join(", ")} and ${pillagedItems[pillagedItemsLen - 1]} were pillaged`;
  }

  return new MessageEmbed()
    .setTitle(title)
    .setDescription(description)
    .setURL(`${biblioConfig.atlasBaseUrl}/realm/${raid.realmId}?tab=History`)
    .setThumbnail(`${biblioConfig.atlasBaseUrl}/siege-tablet.png`)
    .setTimestamp(raid.timestamp);
};

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
  interval: 30000,
  enabled: discordConfig.raidsChannel != null,
  async execute(client: any) {
    try {
      const raids = await fetchRealmHistory(lastTimestamp);
      if (raids && raids.length) {
        client.channels
          .fetch(discordConfig.raidsChannel)
          .then((channel: any) => {
            channel.send({
              embeds: [...raids]
                .reverse()
                .map((raid: any) => buildRaidMessage(raid))
            });
            lastTimestamp = raids[0].timestamp;
          })
          .catch((e: any) => {
            console.error(
              `Error sending raid message at timestamp ${lastTimestamp}`,
              e
            );
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
