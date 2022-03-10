require('dotenv').config();
import { Router } from 'express';
import client from './client';
import { MessageAttachment } from 'discord.js';
import { colours, text, images } from './db/desiege';

interface Action {
    body: Cast
}

interface Cast {
    token_amount: number
    token_offset: number
    token_boost: number
    game_idx: number
    city_health: number
    shield_health: number
}

const routes = Router();



const channel = ["951253679464394812", "951288986389864469"] // light 0, dark 1

const exampleEmbed = (request: Cast, random: number, offset: number) => {
    return {
        title: text[offset].title + " : " + request.token_amount,
        description: text[offset].description,
        color: colours[offset],
        fields: [
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
            url: 'attachment://' + images[offset][random],
        },
        timestamp: new Date(),
        url: 'https://beta.bibliothecadao.xyz/desiege',
    }
};

routes.post('/action', (req: Action, res: any) => {
    const offset = req.body.token_offset - 1

    let num = 0
    const getRandomInt = () => {
        num = Math.floor(Math.random() * (images[offset].length - 1));
    }

    getRandomInt()

    console.log(num)
    console.log(offset)

    const file = new MessageAttachment('app/img/' + images[offset][num]);

    client.channels.fetch(channel[offset])
        .then((channel: any) => {
            channel.send({ embeds: [exampleEmbed(req.body, num, offset)], files: [file] });
        })
        .catch(console.error);

    res.send("hello");
    console.log(req.body);
});

export default routes