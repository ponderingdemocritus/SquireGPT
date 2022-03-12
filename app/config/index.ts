require('dotenv').config();

export const twitterConfig = {
    consumer_key: process.env.CONSUMER_KEY || "",
    consumer_secret: process.env.CONSUMER_SECRET || "",
    access_token: process.env.ACCESS_TOKEN_KEY || "",
    access_token_secret: process.env.ACCESS_TOKEN_SECRET || "",
};

export const discordConfig = {
    client_id: process.env.DISCORD_CLIENT_ID || "",
    guild_id: process.env.DISCORD_GUILD_ID || "",
    token: process.env.DISCORD_TOKEN || ""
}

export const openSeaConfig = {
    "prefix": "!",
    "openseaAssetUrl": "https://api.opensea.io/api/v1/asset",
    "openseaEventsUrl": "https://api.opensea.io/api/v1/events"
}