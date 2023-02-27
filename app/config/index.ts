require("dotenv").config();

export const twitterConfig = {
  consumer_key: process.env.CONSUMER_KEY || "",
  consumer_secret: process.env.CONSUMER_SECRET || "",
  access_token: process.env.ACCESS_TOKEN_KEY || "",
  access_token_secret: process.env.ACCESS_TOKEN_SECRET || ""
};

export const discordConfig = {
  prefix: "!",
  client_id: process.env.DISCORD_CLIENT_ID || "",
  guild_id: process.env.DISCORD_GUILD_ID || "",
  token: process.env.DISCORD_TOKEN || "",
  salesChannel: process.env.DISCORD_SALES_CHANNEL || "",
  listingsChannel: process.env.DISCORD_LISTINGS_CHANNEL || "",
  raidsChannel: process.env.DISCORD_RAIDS_CHANNEL || "",
  imgCrawlChannels: process.env.DISCORD_RAIDS_CHANNEL ? ['1074443915270295712', '1004698995765035021'] : ['1050032823341424640']
};

export const openSeaConfig = {
  openseaAssetUrl: "https://api.opensea.io/api/v1/asset",
  openseaEventsUrl: "https://api.opensea.io/api/v1/events",
  openseaApiKey: process.env.OPEN_SEA_API_KEY || "",
  collectionName: process.env.OPEN_SEA_COLLECTION_NAME,
  contractAddress: process.env.REALMS_CONTRACT_ADDRESS
};

export const biblioConfig = {
  indexerUrl: "https://dev-indexer-gu226.ondigitalocean.app/graphql",
  atlasBaseUrl: process.env.ATLAS_URL
};

export const podConfig = {
  endpoint: "https://api.runpod.ai/v1/",
  podBearer: process.env.POD_BEARER,
  header: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.POD_BEARER}`
  }
};

export const railwayConfig = {
  url: "https://bot-production-da53.up.railway.app"
}