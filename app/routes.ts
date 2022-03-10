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

const exampleEmbed = (request: Cast, random: number) => {
    return {
        title: text[request.token_offset - 1].title + " : " + request.token_amount,
        description: text[request.token_offset - 1].description,
        color: colours[request.token_offset - 1],
        fields: [
            {
                name: 'City Health',
                value: request.city_health,
            },
            {
                name: 'Shield Health',
                value: request.shield_health
            },
            {
                name: 'Game ID',
                value: request.game_idx
            },
        ],
        image: {
            url: 'attachment://' + images[request.token_offset - 1][random],
        },
        timestamp: new Date(),
        url: 'https://beta.bibliothecadao.xyz/desiege',
    }
};

routes.post('/action', (req: Action, res: any) => {
    let num = 0
    const getRandomInt = () => {
        num = Math.floor(Math.random() * images[req.body.token_offset - 1].length) - 1;
    }

    getRandomInt()

    const file = new MessageAttachment('app/img/' + images[req.body.token_offset - 1][num]);

    client.channels.fetch(channel[req.body.token_offset - 1])
        .then((channel: any) => {
            channel.send({ embeds: [exampleEmbed(req.body, num)], files: [file] });
        })
        .catch(console.error);

    res.send("hello");
    console.log(req.body);
});

export default routes