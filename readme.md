# Squire: Discord & Twitter Bot

Squire is a multitalented bot. He interfaces with Discord and Twitter. Currently this repo is heavily catered towards the needs of Bibliotheca DAO and the Lootverse in general.

Further abstraction is needed to make this bot plug and playable by other teams. But by all means fork him and customise.

---

## GOAL

The goal of this little bot is to be the interface between StarkNet and Discord. It aims to be the go-to resource for all Adventurers within StarkNet.

---

## What Starkey currently does:

- Receives Desiege Updates & posts to discord & twitter.
- Fetches Realm Information
- Fetches Crypts & Caverns Information

---

# Contributing

## Getting started

1. [Create a Discord App (bot)](https://discord.com/developers/applications) to test updates in your server.
2. (optional) Request a [Twitter Developer Account](https://developer.twitter.com/en/apply-for-access) (with [Elevated Access](https://developer.twitter.com/en/portal/products/elevated), then create a Twitter Developer App (make sure you change it to have both read/write permissions).
3. (optional) Install [Twurl](https://github.com/twitter/twurl) and, using your Twitter Developer consumer key & secret, generate the access token & access secret.

## Environment Setup
Edit `example.env` with the following environment variables:
* DISCORD_TOKEN: A [discord bot token](https://www.writebots.com/discord-bot-token/) created via the app's "Bot -> Build-a-bot" menu.
* DISCORD_CLIENT_ID: A discord bot client ID created via the app's "OAuth2" menu.
* DISCORD_GUILD_ID: A discord bot guild ID found via enabling [Developer Mode](https://github.com/manix84/discord_gmod_addon_v2/wiki/Finding-your-Guild-ID-%28Server-ID%29).
* CONSUMER_KEY - Your Twitter Developer App's Consumer Key
* CONSUMER_SECRET - Your Twitter Developer App's Consumer Secret
* ACCESS_TOKEN_KEY - The Access Token Key of the Twitter Account your bot is posting from
* ACCESS_TOKEN_SECRET - The Access Token Secret of the Twitter Account your bot is posting from


## Running the bot
```
yarn && yarn start
```

# How to make changes

## Discord

### Adding a slash command:

1. Create new file in services/discord/commands
2. Copy existing contents from another command
3. Add a name to the function in the exports
4. Include what you would like to return
5. Run locally and test on your own server

# TODO:

- Add subscriptions to listen to indexer and publish updates to discord.
- Add more utility functions for the Realms, Crypts, Lootverse in general

---
