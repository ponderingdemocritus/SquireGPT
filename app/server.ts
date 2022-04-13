require('dotenv').config();
import express from 'express';
import ApiRouter from './router'
import client from './services/discord';
import { setupDiscordCommands } from './services/discord/deploy';
const app = express();
const port = 3000;

client

setupDiscordCommands()

app.use(express.json());

app.use("/", ApiRouter)

app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});