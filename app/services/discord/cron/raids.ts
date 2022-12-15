require("dotenv").config();
import fetch from "node-fetch";
import { biblioConfig, discordConfig } from "../../../config";
import { formatFixed } from "@ethersproject/bignumber";
// import { history } from "../../../services/utils/testing/responses";
import { MessageActionRow, MessageButton } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { resources } from "../../../db/resources";
import WebSocket from 'ws';

const formatEther = (value: string) => formatFixed(value, 18);

/*
  1. query indexer for new events
  2. hit the midware event with a POST
  3. POST returns jobId which is used to open a websocket
  4. listen to websocket until a json with a uri is received
  5. build raidmessage
  6. submit raidmessage

*/

// const MIDWARE_ADDRESS = "127.0.0.1:8000" // no http!
const MIDWARE_ADDRESS = "fastapi-production-e3aa.up.railway.app"

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
                        eventType: { equals:"realm_combat_attack" }, 
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
        `,
      }),
    });
    const results = await response.json();
    return results.data.history;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const buildRaidMessage = (raid: any, imageUri: String) => {
  let title;
  let description = "";
  let pillagedItems: string[] = [];
  let fields = [];

  fields.push(
    {
      name: `ATTACKER`,
      value: `${raid.realmName} - ${raid.realmId}`,
      inline: false,
    },
    {
      name: `DEFENDER`,
      value: `${raid.data.defendRealmName} - ${raid.data.defendRealmId}`,
      inline: false,
    }
  );

  if (!raid.data.success) {
    title = "Raid Success!";
    description = `${raid.data.defendRealmName} [${raid.data.defendRealmId}] was pillaged by ${raid.realmName}`;
    if (raid.data.relicLost) {
      fields.push({
        name: `Relic ${raid.data.relicLost} stolen!`,
        value: "\u200b",
        inline: false,
      });
    }
  } else {
    title = "Raid Failure!";
    description = `${raid.data.defendRealmName} [${raid.data.defendRealmId}] was attacked by ${raid.realmName} but failed...`;
  }

  // Sort incoming resources
  const resourceNames = resources.map((resource: any) => {
    return resource.trait; //get the names from the resources list (these are ordered)
  });
  const comparePillagedResources = (a: any, b: any) => {
    if (
      resourceNames.indexOf(a.resourceName) <
      resourceNames.indexOf(b.resourceName)
    ) {
      return -1;
    } else if (
      resourceNames.indexOf(a.resourceName) >
      resourceNames.indexOf(b.resourceName)
    ) {
      return 1;
    }
    return 0;
  };
  const orderedPillagedResources = raid.data.pillagedResources.sort(
    comparePillagedResources
  );

  pillagedItems = orderedPillagedResources.map((resource: any) => {
    return `${formatEther(resource.amount)} ${resource.resourceName}`;
  });

  const pillagedItemsLen = pillagedItems.length;

  if (pillagedItemsLen === 0) {
    // description = "No resources were pillaged";
  }
  // description = `${pillagedItems[0]} was pillaged`;
  else {
    orderedPillagedResources.forEach((resource: any) => {
      fields.push({
        name: `${formatEther(resource.amount)} ${resource.resourceName
          } pillaged!\n`,
        value: "\u200b",
        inline: true,
      });
    });
  }

  const resourceString = orderedPillagedResources.map((a: any) => {
    return a.resourceName;
  });

  return {
    resources: resourceString,
    attributes: {
      title: title,
      description: description,
      image: {
        // url: `https://ingave-images.s3.eu-west-3.amazonaws.com/37a7186b-${raid.eventId}.png`,
        url: imageUri,
      },
      thumbnail: {
        url: `https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${raid.realmId}.webp`,
      },
      fields: fields,
      // url: ``,
    },
  };
};

const postMessage = async (client: any, element: any, imageUri: String) => {
  const message = buildRaidMessage(element, imageUri);

  const row = new MessageActionRow().addComponents(
    new MessageButton()

      .setLabel("See Realm")
      // .setURL(message.attributes.url)
      .setStyle(MessageButtonStyles.LINK)
  );

  client.channels
    .fetch(discordConfig.raidsChannel)
    .then((channel: any) => {
      channel.send({
        embeds: [message.attributes],
        components: [row],
      });
    })
    .then((text: any) => {
      for (const resource of message.resources) {
        const emoji = client.emojis.cache.find(
          (emoji: any) => emoji.name === resource.replace(" ", "")
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
}

const generateAndPostImage = async (client: any, raid: any) => {
  try {
<<<<<<< HEAD
    console.log("posting to cier")

=======
>>>>>>> e05ff03f77e175e13768fd23a91659fca4fef0f8
    const response = await fetch(`https://${MIDWARE_ADDRESS}/api/v1/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(raid),
    });
    const results = await response.json();

    console.log(results)

    const generated_image = results[0] // we expect only 1 image

    if (generated_image?.uri != "") {
      postMessage(client, raid, generated_image.uri)
      return
    }

    const socketUrl = `wss://${MIDWARE_ADDRESS}/api/v1/${generated_image.id}/status`;
    const ws = new WebSocket(socketUrl)

    ws.on('open', function open() {
      console.log("ws opened")
    });

    ws.on('message', function message(data) {
      console.log('received: %s', data);
      if (String(data) === "initiated") {
        console.log(`jobId ${generated_image.id} initiated`)
      }
      else if (String(data) === "generating") {
        console.log(`jobId ${generated_image.id} generating`)
      }
      else if (String(data) === "done") {
        console.log(`jobId ${generated_image.id} done`)
        ws.close()
      }
      else {
        const body = JSON.parse(String(data))
        postMessage(client, raid, body.uri)
      }
    });
  } catch (e) {
    console.error(e);
  }
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



// let lastTimestamp = new Date().getTime();
let lastTimestamp = new Date(2022, 11, 1).getTime();
lastTimestamp = 1670959403000;

export = {
  name: "raid",
  description: "raid bot",
  interval: 1000,
  enabled: discordConfig.raidsChannel != null,
  async execute(client: any) {
    try {
      console.log("checking for raids");
      const raids = await fetchRealmHistory(lastTimestamp);

      if (raids && raids.length) {
<<<<<<< HEAD
        await generateAndPostImage(client, raids[0]);
        lastTimestamp = Math.max(lastTimestamp, raids[0].timestamp);
        // raids.forEach(async (raid: any) => {
        //   await generateAndPostImage(client, raid);
        //   // set lastTimestamp to the timestamp of the last raid if it's larger
        //   lastTimestamp = Math.max(lastTimestamp, raid.timestamp);
        // });
=======
        raids.forEach(async (raid: any) => {
          // await generateAndPostImage(client, raid);
          // set lastTimestamp to the timestamp of the last raid if it's larger
          lastTimestamp = Math.max(lastTimestamp, raid.timestamp);
        });
>>>>>>> e05ff03f77e175e13768fd23a91659fca4fef0f8
      }
    } catch (e) {
      console.error(
        `Error sending raid message at timestamp ${lastTimestamp}`,
        e
      );
    }
  },
};
