"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = require("express");
const client_1 = __importDefault(require("./services/client"));
const discord_js_1 = require("discord.js");
const desiege_1 = require("./db/desiege");
const tweet_1 = require("./services/tweet");
const routes = (0, express_1.Router)();
const channel = ["951253679464394812", "951288986389864469"]; // light 0, dark 1
const embed = (request, random, offset) => {
    return {
        title: desiege_1.text[offset].title + " : " + (request.token_amount * (request.token_boost / 10000 + 1)),
        description: desiege_1.text[offset].description,
        color: desiege_1.colours[offset],
        fields: [
            {
                name: 'Boost',
                value: (request.token_boost / 10000 + 1).toString() || "0"
            },
            {
                name: 'City Health',
                value: request.city_health.toString() || "0"
            },
            {
                name: 'Shield Health',
                value: request.shield_health.toString() || "0"
            },
            {
                name: 'Game ID',
                value: request.game_idx.toString() || "0"
            },
        ],
        image: {
            url: 'attachment://' + desiege_1.images[offset][random],
        },
        timestamp: new Date(),
        url: 'https://beta.bibliothecadao.xyz/desiege',
    };
};
routes.post('/action', (req, res) => {
    const offset = req.body.token_offset - 1;
    let num = 0;
    const getRandomInt = () => {
        num = Math.floor(Math.random() * (desiege_1.images[offset].length - 1));
    };
    getRandomInt();
    const file = new discord_js_1.MessageAttachment('app/img/' + desiege_1.images[offset][num]);
    // tweet
    (0, tweet_1.tweet)(req.body, offset, num);
    client_1.default.channels.fetch(channel[offset])
        .then((channel) => {
        channel.send({ embeds: [embed(req.body, num, offset)], files: [file] });
    })
        .catch(console.error);
    res.send("YESS!!!");
});
exports.default = routes;
//# sourceMappingURL=routes.js.map