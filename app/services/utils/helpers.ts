import fetch from "node-fetch";
import { getRealm } from './graphql'
import { resources } from "../../db/resources";
import { request } from "graphql-request";
import { podConfig, railwayConfig } from '../../config';
import { formatFixed } from '@ethersproject/bignumber';

export const settings = {
    method: "GET"
};

export const buildMessage = async (openSeaEvent: any, sale: boolean) => {

    const variables = {
        id: openSeaEvent.asset.token_id.toString(),
    };
    const { realm } = await request(
        "https://api.thegraph.com/subgraphs/name/bibliothecaforadventurers/realms",
        getRealm,
        variables
    );

    const resourceString = resources
        .filter((a: any) => realm.resourceIds.includes(a.id))
        .map((a: any) => {
            return a.trait;
        })

    let description;

    const fields = [
        {
            name: "RARITY RANK",
            value: realm.rarityRank.toString() || "0",
            inline: true,
        },
        {
            name: "RARITY SCORE",
            value: realm.rarityScore.toString() || "0",
            inline: true,
        },
        {
            name: "ORDER",
            value: "Order of " + realm.order,
            inline: true,
        },
        {
            name: "\u200b",
            value: "\u200b",
            inline: false,
        },
        {
            name: "RESOURCES",
            value: resourceString.join(' | '),
            inline: true,
        },
        {
            name: "\u200b",
            value: "\u200b",
            inline: false,
        },
        {
            name: "REGIONS",
            value: realm.regions.toString() || "0" + " / 7",
            inline: true,
        },
        {
            name: "CITIES",
            value: realm.cities.toString() || "0" + " / 21",
            inline: true,
        },
        {
            name: "\u200b",
            value: "\u200b",
            inline: false,
        },
        {
            name: "HARBOURS",
            value: realm.harbours.toString() || "0" + " / 35",
            inline: true,
        },
        {
            name: "RIVERS",
            value: realm.rivers.toString() || "0" + " / 60",
            inline: true,
        },
        {
            name: "\u200b",
            value: "\u200b",
            inline: false,
        },
        {
            name: "OPEN SEA",
            value: `[View On Open Sea](https://opensea.io/assets/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/${openSeaEvent.asset.token_id})`,
            inline: true,
        },
    ];

    if (realm.wonder) {
        fields.splice(1, 0, {
            name: "WONDER",
            value: realm.wonder,
            inline: true,
        });
    }

    if (sale) {
        description = `has just been sold for ${openSeaEvent.total_price / 1e18}\u039E`;

        fields.push(
            {
                name: "From",
                value: `[${openSeaEvent.seller.user?.username || openSeaEvent.seller.address.slice(0, 8)
                    }](https://etherscan.io/address/${openSeaEvent.seller.address})`,
                inline: true,
            },
            {
                name: "To",
                value: `[${openSeaEvent.winner_account.user?.username ||
                    openSeaEvent.winner_account.address.slice(0, 8)
                    }](https://etherscan.io/address/${openSeaEvent.winner_account.address})`,
                inline: true,
            }
        );
    } else {
        description = `has just been listed for ${openSeaEvent.starting_price / 1e18
            }\u039E`;

        fields.push({
            name: "From",
            value: `[${openSeaEvent.seller.user?.username || openSeaEvent.seller.address.slice(0, 8)
                }](https://etherscan.io/address/${openSeaEvent.seller.address})`,
            inline: true,
        });
    }

    return {
        resources: resourceString,
        attributes: {
            title: realm.name,
            description: description,
            image: {
                url: `https://d23fdhqc1jb9no.cloudfront.net/renders_webp/${openSeaEvent.asset.token_id}.webp`,
            },
            thumbnail: {
                url: `https://d23fdhqc1jb9no.cloudfront.net/_Realms/${openSeaEvent.asset.token_id}.svg`,
            },
            fields: fields,
            url: "https://bibliothecadao.xyz/realms/" + openSeaEvent.asset.token_id,
        }
    };
};

export async function createImage(prompt: any, model: string) {
    // Initial call to start image creation
    const initResponse = await fetch(`${podConfig.endpoint + model}/run`, {
        method: 'POST',
        headers: podConfig.header,
        body: JSON.stringify(prompt)
    });

    const response = await initResponse.json();

    const jobId = response.id;

    // Poll endpoint until image is complete
    let imageComplete = false;
    let imageUri;
    while (!imageComplete) {
        const pollResponse = await fetch(`${podConfig.endpoint + model}/status/` + jobId, {
            method: 'GET',
            headers: podConfig.header,
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

export const formatEther = (value: string) => formatFixed(value, 18);


export const getLLM = async (prompt: string, endpoint: string) => {
    let url = `${railwayConfig.url}${endpoint}`
    let res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            question: prompt
        }),
    });

    if (res.status == 404 || res.status == 400) {
        throw new Error("Error retrieving collection stats.");
    }
    if (res.status != 200) {
        throw new Error(`Couldn't retrieve metadata: ${res.statusText}`);
    }
    let data = await res.json();

    return data.report;
}