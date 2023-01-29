require("dotenv").config();
import fetch from "node-fetch";
import { biblioConfig, discordConfig } from "../../../config";
import { formatFixed } from "@ethersproject/bignumber";
import { MessageActionRow, MessageButton } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { resources } from "../../../db/resources";
// import WebSocket from 'ws';

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
// const MIDWARE_ADDRESS = "fastapi-production-e3aa.up.railway.app"

const POD_ENDPOINT = "https://api.runpod.ai/v1/";
const MODEL = "sd-openjourney/";

const POD_BEARER = process.env.POD_BEARER;

const HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${POD_BEARER}`
}

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
      name: 'ATTACKER',
      value: `${raid.realmName} - ${raid.realmId}`,
      inline: false,
    },
    {
      name: 'DEFENDER',
      value: `${raid.data.defendRealmName} - ${raid.data.defendRealmId}`,
      inline: false,
    }
  );

  if (raid.data.success) {
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
      url: `${biblioConfig.atlasBaseUrl}/realm/${raid.realmId}?tab=History`,
    },
  };
};

const postMessage = async (client: any, raid: any, imageUri: String) => {
  const message = buildRaidMessage(raid, imageUri);

  console.log("MESSAGE:")
  console.log(message)

  const row = new MessageActionRow().addComponents(
    new MessageButton()

      .setLabel("See Realm")
      .setURL(message.attributes.url)
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

const WIN_PROMPT = {
  "input": {
    "prompt": "knights on horseback riding into the distance on an open plain with the sun setting, impressionist painting, 16K resolution, Landscape veduta photo by Dustin Lefevre & tdraw, 8k resolution, detailed landscape painting by Ivan Shishkin, DeviantArt, Flickr, rendered in Enscape, Miyazaki, Nausicaa Ghibli, Breath of The Wild, 4k detailed post processing, atmospheric, hyper realistic, 8k, epic composition, cinematic, artstation",
    "negative_prompt": "cartoon, imperfect, poor quality, saturated, unrealistic",
    "width": 768,
    "height": 576
  }
}

const LOSS_PROMPT = {
  "input": {
    "prompt": "a street of a medievel town, there are flames everywhere, there are dead bodies on the ground and people running in every direction whilst armoured knights are patrolling, impressionist painting, 16K resolution, Ivan Shishkin, DeviantArt, Flickr, rendered in Enscape, Miyazaki, Nausicaa Ghibli, Breath of The Wild, 4k detailed post processing, atmospheric, hyper realistic, 8k, epic composition, cinematic, artstation",
    "negative_prompt": "cartoon, imperfect, poor quality, saturated, unrealistic",
    "width": 768,
    "height": 576
  }
}

async function createImage(success: boolean) {
  // Initial call to start image creation
  const initResponse = await fetch(`${POD_ENDPOINT + MODEL}run`, {
    method: 'POST',
    headers: HEADER,
    body: JSON.stringify(success ? WIN_PROMPT : LOSS_PROMPT)
  });

  const response = await initResponse.json();

  const jobId = response.id;

  // Poll endpoint until image is complete
  let imageComplete = false;
  let imageUri;
  while (!imageComplete) {
    const pollResponse = await fetch(`${POD_ENDPOINT + MODEL}status/` + jobId, {
      method: 'GET',
      headers: HEADER,
    });
    const pollJson = await pollResponse.json();

    if (pollJson.status == 'COMPLETED') {
      imageComplete = true;
      imageUri = pollJson.output[0].image;
    } else {
      // Wait for 1 second before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return imageUri;
}

const generateAndPostImage = async (client: any, raid: any) => {
  try {
    createImage(raid.data.success).then((imageUri) => { postMessage(client, raid, imageUri) })
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
        await generateAndPostImage(client, raids[0]);
        lastTimestamp = Math.max(lastTimestamp, raids[0].timestamp);
      }

    } catch (e) {
      console.error(
        `Error sending raid message at timestamp ${lastTimestamp}`,
        e
      );
    }
  },
};
