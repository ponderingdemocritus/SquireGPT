import { Client, Intents } from 'discord.js';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const token = process.env.DISCORD_TOKEN

client.once('ready', () => {
    console.log('Ready!');
});

client.login(token);

export default client