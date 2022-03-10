"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = require("express");
const client_1 = __importDefault(require("./client"));
const discord_js_1 = require("discord.js");
// const exampleReg = {
//     tokens: "100",
//     type: 1,
// }
const routes = (0, express_1.Router)();
const file = new discord_js_1.MessageAttachment('app/img/lightning-strikes-sweet-dreams.gif');
const channel = process.env.CHANNEL_ID || "";
routes.get('/attack', (req, res) => {
    console.log(req.body);
    const exampleEmbed = {
        title: 'Light has Boosted',
        image: {
            url: 'attachment://lightning-strikes-sweet-dreams.gif',
        },
    };
    client_1.default.channels.fetch(channel)
        .then((channel) => {
        channel.send({ embeds: [exampleEmbed], files: [file] });
    })
        .catch(console.error);
    res.send("hello");
});
exports.default = routes;
//# sourceMappingURL=routes.js.map