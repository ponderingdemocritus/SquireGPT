require('dotenv').config();
import express from 'express';
import routes from './routes'
import client from './services/discord';
import { setupDiscordCommands } from './services/discord/deploy';
const app = express();
const port = 3000;

client

setupDiscordCommands()

app.use(express.json());

app.use("/", routes)

app.listen(port, () => {
    console.log(`⚡️ Running on ${port}.`);
});