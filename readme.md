# 

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/gandalf.png">
  <img alt="Dojo logo" align="right" width="120" src=".github/gandalf.png">
</picture>

## SquireGPT: A Langchain and Pinecone-Powered Chatbot


- [Getting Started](#getting-started)
  - [1. Setup environment and customize Agent](#1-setup-environment-and-customize-agent)
  - [2. Setup Pinecone](#2-setup-pinecone)
  - [3. Open AI Setup](#3-open-ai-setup)
  - [4. Discord Setup](#4-discord-setup)
  - [5. Running CLI](#5-running-cli)
  - [6. Deploying](#6-deploying)
  - [Adding to Discord server](#adding-to-discord-server)
- [How To](#how-to)
  - [Add Discord slash command](#add-discord-slash-command)
  - [Run Babyagi](#run-babyagi)
- [FAQ](#faq)

Squire is a versatile chatbot that leverages the power of Langchain and Pinecone's advanced indexing capabilities to deliver an efficient and seamless conversational experience. At present, Squire supports interaction through various channels, including Discord, Command Line Interface (CLI), and RESTful API. 

With Squire, you can effortlessly index documents into a Pinecone index, enabling you to chat about the contents of these documents within Discord or retrieve relevant information through the API. 

Supported documents:
- .PDF
- .TXT
- .JSON
- .MD
- .ADOC

Note: This is in active development and things might break...

Todo:
- [ ] Add Twitter
- [ ] Add Telegram
- [ ] Document loader via Discord command
- [ ] Load documents via web loader
- [ ] One-click deploy

# Getting Started

## 1. Setup enviroment and customise Agent

```bash
cp example.env .env
```

You can choose to edit the personality of the agent by changing the context within the config file. The default is Gandalf.

### 2. Setup Pinecone

1. First, navigate to https://www.pinecone.io/ and create a new index by following these steps:
    1. Sign in or sign up for an account if you haven't already.
    2. Select "Create Index" from the dashboard.
    3. Customize the index settings as per your requirements. For testing purposes, you can use the default number of base replicas. Ensure you set the following parameters:

    - Dimensions: 1536
    - Metric: Cosine

2. From the Pinecone dashboard, click API Keys
4. Copy the API key, or create a new one if needed.
5. Locate the .env file
6. Add the following line, replacing <YOUR_API_KEY> with the API key you copied:

```bash
PINECONE_API_KEY=<YOUR_API_KEY>
PINECONE_INDEX="test" // you only need the name here not the entire string
PINECONE_NAMESPACE="demo" // optional namespace
PINECONE_ENVIROMENT="us-central1-gcp"

```
10. Save the changes made to the .env file.

### 3. Open AI Setup

1. Get your OpenAI API key from the OpenAI dashboard and save in your `.env`

### 4. Discord Setup

Create a new Discord App by following these steps:

1. Go to the Discord Developer Portal.
2. Sign in with your Discord account or sign up if you don't have one.
3. Click the "New Application" button in the top-right corner.
4. Enter a name for your app and click "Create".

Retrieve the necessary Discord details from the dashboard and securely store them in your project's .env file:

1. Navigate to the "Bot" tab on the left sidebar within your app's settings.
2. Click "Add Bot" and confirm the action.
3. Find the "TOKEN" section, and click "Copy" to copy the bot token.
4. Go back to the "General Information" tab and locate the "CLIENT ID" section. Copy the client ID.
5. In your project folder, locate the .env file (create one if it doesn't exist).
6. Add the following lines, replacing <YOUR_BOT_TOKEN> and <YOUR_CLIENT_ID> with the respective values you copied:

```bash
DISCORD_TOKEN=<YOUR_BOT_TOKEN>
DISCORD_CLIENT_ID=<YOUR_CLIENT_ID>
```
7. Save the changes made to the .env file.

### 5. Running CLI
Install the required dependencies for your project, if you haven't already.

```bash
yarn
```

1. Start your local instance by running the appropriate command for your project.

```
yarn cli
```

3. Once your local instance is running, it will act as a server for testing, so there is no need to deploy at this stage.
    1. You can now load documents by selecting `Load documents via directory` command and entering the directory that your documents are located.
    2. After loading the documents, then proceed to `Chat` with the Agent with the command
    3. Once complete shutdown the server

5. If you don't want to run the cli, just:

```js
yarn start
```
6. if you are running Node < 18 you will need to:

```js
export NODE_TLS_REJECT_UNAUTHORIZED='0'
export NODE_OPTIONS='--experimental-fetch'
```
### 6. Deploying
Deploy anywhere you can run Docker! 

### Adding to Discord server

Use the auth builder link within the discord dashboard. When adding to discord make sure to include the `applications.commands` in the auth scope.

---

## How To

### Add Discord slash command

1. Create new file in `/app/services/discord/commands`
2. Copy existing contents from another command
3. Add a name to the function in the exports
4. Complete the logic
5. Run!


## Run Babyagi

Fork of [Babyagi](https://github.com/yoheinakajima/babyagi)

Create a table in Pinecone and add `TASKER_TABLE=` to your .env

Then:

```bash
yarn cli

# Select Babyagi
```

---

## FAQ

**Q: "I tried running my bot but get a 'Missing Access 50001' error"**

A: This means that your application doesn't have permission for the discord server in question.

First, make sure you've granted the bot the `applications.commands` OAuth2 scope [Docs](https://discord.com/developers/docs/topics/oauth2) and visited the URL under the 'OAuth2' tab in the [Discord developer dashboard for your bot](https://discord.com/developers/applications/).
