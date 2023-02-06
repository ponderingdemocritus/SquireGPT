require('dotenv').config();
import express from 'express';
import ApiRouter from './router'
import client from './services/discord';
import { setupDiscordCommands } from './services/discord/deploy';
import { Database } from 'sqlite3';
import { createUsersTable } from './sqlite';
const app = express();
const port = 3000;

client

setupDiscordCommands()

export const db = new Database('db.sqlite');

async function main(): Promise<void> {
    await createUsersTable();
}

main();

app.use(express.json());

app.use("/", ApiRouter)

app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});