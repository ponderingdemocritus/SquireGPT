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
const routes = (0, express_1.Router)();
const channel = ["951288986389864469", "951253679464394812"]; // light 0, dark 1
const exampleEmbed = (request, random) => {
    return {
        title: desiege_1.text[request.token_offset].title + " : " + request.token_amount,
        description: desiege_1.text[request.token_offset].description,
        color: desiege_1.colours[request.token_offset],
        image: {
            url: 'attachment://' + desiege_1.images[request.token_offset][random],
        },
        timestamp: new Date(),
        url: 'https://beta.bibliothecadao.xyz/desiege',
    };
};
routes.get('/action', (req, res) => {
    let num = 0;
    const getRandomInt = () => {
        num = Math.floor(Math.random() * desiege_1.images.length) - 1;
    };
    getRandomInt();
    const file = new discord_js_1.MessageAttachment('app/img/' + desiege_1.images[req.body.token_offset][num]);
    client_1.default.channels.fetch(channel[0])
        .then((channel) => {
        channel.send({ embeds: [exampleEmbed(req.body, num)], files: [file] });
    })
        .catch(console.error);
    res.send("hello");
    console.log(req.body);
});
exports.default = routes;
//# sourceMappingURL=routes.js.map