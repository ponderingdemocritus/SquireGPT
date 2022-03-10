require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const token = process.env.DISCORD_TOKEN

client.once('ready', () => {
  console.log('Ready!');
});

// Login to Discord with your client's token
client.login(token);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require('./routes.js')(app, fs, client);

const server = app.listen(3001, () => {
  console.log('listening on port %s...', server.address().port);
});