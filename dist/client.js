"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
const token = process.env.DISCORD_TOKEN;
client.once('ready', () => {
    console.log('Ready!');
});
client.login(token);
exports.default = client;
//# sourceMappingURL=client.js.map