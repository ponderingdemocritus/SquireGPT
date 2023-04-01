require('dotenv').config();
import { PineconeClient } from '@pinecone-database/pinecone';
import express from 'express';
import ApiRouter from './router'
import { client as DiscordClient } from './services/discord';
import { setupDiscordCommands } from './services/discord/deploy';

const app = express();
const port = 3000;

DiscordClient

setupDiscordCommands()

export const pinecone = new PineconeClient();
async function main(): Promise<void> {
    await pinecone.init({
        environment: process.env.PINECONE_ENVIROMENT || "us-central1-gcp",
        apiKey: process.env.PINECONE_KEY || "",
    });
}

main();

app.use(express.json());

app.use("/", ApiRouter)

app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});