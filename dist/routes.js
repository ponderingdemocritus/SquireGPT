"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = require("express");
const client_1 = __importDefault(require("./client"));
const discord_js_1 = require("discord.js");
const desiege_1 = require("./db/desiege");
const exampleReg = {
    tokens: "100",
    type: 1,
};
const routes = (0, express_1.Router)();
const file = new discord_js_1.MessageAttachment('app/img/lightning-strikes-sweet-dreams.gif');
const channel = ["951253679464394812", "951288986389864469"]; // light 0, dark 1
const exampleEmbed = (offset) => {
    return {
        title: desiege_1.text[offset].title + " : " + exampleReg.tokens,
        description: desiege_1.text[offset].description,
        color: desiege_1.colours[offset],
        image: {
            url: 'attachment://lightning-strikes-sweet-dreams.gif',
        },
    };
};
routes.get('/action', (req, res) => {
    console.log(req.body);
    client_1.default.channels.fetch(channel[0])
        .then((channel) => {
        channel.send({ embeds: [exampleEmbed(0)], files: [file] });
    })
        .catch(console.error);
    res.send("hello");
});
exports.default = routes;
//# sourceMappingURL=routes.js.map