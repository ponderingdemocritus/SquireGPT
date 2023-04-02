# SquireGPT: A Langchain and Pinecone-Powered Chatbot

Squire is a chatbot that utilizes Langchain and Pinecone's efficient indexing capabilities. It seamlessly integrates with Discord or can be accessed through a rest API for versatile usage.

With Squire, you can effortlessly index documents into a Pinecone index, enabling you to chat about the contents of these documents within Discord or retrieve relevant information through the API.

Todo:
- [ ] Add Twitter
- [ ] Add Telegram
- [ ] Document loader via Discord command
- [ ] One-click deploy

## Getting started

## 1. Getting started

Copy the template .env and fill in the details
```bash
cp example.env .env
```

### 2. Setup Pinecone

1. Head to https://www.pinecone.io/ and setup a new index with the parameters. Other parameters are to your liking, but the base replicas are fine for testing.

- Dimensions: 1536
- Cosine

2. Get your API key and save in your `.env`


### 3. Discord Setup

1. [Create a Discord App](https://discord.com/developers/applications)
2. Retrieve Discord details from the dashboard and save in your `.env`

### 4. OpenAI Setup

1. Get your OpenAI API key from the OpenAI dashboard and save in your `.env`


### 5. Running
Run it locally and access the API via Postman for testing, or add Squire to a discord server. Your local instance will act as a server for testing, so you don't need to deploy at this stage. Recommended to make a vanilla discord server to play around with before adding to production.

```js
yarn && yarn dev

// if you are running Node < 18 you will need to:
export NODE_TLS_REJECT_UNAUTHORIZED='0'
export NODE_OPTIONS='--experimental-fetch'
```

### 6. Embedding documents

You can now embed your documents in a Pinecone instance so your instance can ask questions. These could be .pdfs, .md, .csv, or .txt documents.

```
yarn ingest <directory path>
```

This will load all your documents into the pinecone db, so you will then be able to talk to it. 

## 6. Deploying
Deploy anywhere you can run a Docker instance! 


## Adding to Discord

Use the auth builder link within the discord dashboard. When adding to discord make sure to include the `applications.commands` in the auth scope.

---

## How To

### Add slash command

1. Create new file in `/app/services/discord/commands`
2. Copy existing contents from another command
3. Add a name to the function in the exports
4. Complete the logic
5. Run!

---

## FAQ

**Q: "I tried running my bot but get a 'Missing Access 50001' error"**

A: This means that your application doesn't have permission for the discord server in question.

First, make sure you've granted the bot the `applications.commands` OAuth2 scope [Docs](https://discord.com/developers/docs/topics/oauth2) and visited the URL under the 'OAuth2' tab in the [Discord developer dashboard for your bot](https://discord.com/developers/applications/).
