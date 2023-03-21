require('dotenv').config();
import { PineconeClient } from '@pinecone-database/pinecone';
import express from 'express';
import { blobert, ConversationAgent, visir } from './agents';
import ApiRouter from './router'
import { client as DiscordClient } from './services/discord';
import { setupDiscordCommands } from './services/discord/deploy';
// import { Database } from 'sqlite3';
// import { createUsersTable } from './sqlite';
// import { Client as PostgresClient } from 'pg';

const app = express();
const port = 3000;

DiscordClient

setupDiscordCommands()

export const pinecone = new PineconeClient();



// export const db = new Database('db.sqlite');

// export const client = new PostgresClient({
//     host: 'app-1de1be1e-ff98-4f77-a735-68b1c35ad66c-do-user-10698562-0.b.db.ondigitalocean.com',
//     user: 'doadmin',
//     password: 'tQ8dnc03mOBrSjfx',
//     database: 'squire',
//     port: 25060,
//     ssl: true
// });

async function main(): Promise<void> {
    await pinecone.init({
        environment: "us-central1-gcp",
        apiKey: process.env.PINECONE_KEY || "",
    });
}

main();

export const visir_chat = new ConversationAgent(visir);
export const blobert_chat = new ConversationAgent(blobert);

app.use(express.json());

app.use("/", ApiRouter)

app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});