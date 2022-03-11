require('dotenv').config();
import { Router } from 'express';
import client from './services/client';
import { MessageAttachment } from 'discord.js';
import { colours, text, images, final } from './db/desiege';
import { tweet } from './services/tweet'
import { Cast, Action } from './types';

const routes = Router();

const channel = ["951253679464394812", "951288986389864469"] // light 0, dark 1

const embed = (request: Cast, random: number, offset: number) => {

    if (request.city_health === 0) {
        return {
            title: 'The Dark Forces have destroyed the Divine City.',
            description: 'All hail our Dark overlords.',
            color: '#000',
            image: {
                url: 'attachment://' + final[0][0],
            },
            timestamp: new Date(),
            url: 'https://beta.bibliothecadao.xyz/desiege',
        }
    } else {
        return {
            title: text[offset].title + " : " + (request.token_amount * (request.token_boost / 1000 + 1)),
            description: text[offset].description,
            color: colours[offset],
            fields: [
                {
                    name: 'Boost',
                    value: (request.token_boost / 1000 + 1).toString() || "0"
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
                url: 'attachment://' + images[offset][random],
            },
            timestamp: new Date(),
            url: 'https://beta.bibliothecadao.xyz/desiege',
        }
    }

};

routes.post('/action', (req: Action, res: any) => {


    const offset = req.body.token_offset - 1
    let file: any
    let num = 0

    const getRandomInt = () => {
        num = Math.floor(Math.random() * (images[offset].length - 1));
    }

    getRandomInt()
    if (req.body.city_health === 0) {
        file = new MessageAttachment('app/img/' + final[0][0]);
    } else {
        file = new MessageAttachment('app/img/' + images[offset][num]);
    }

    // tweet
    tweet(req.body, offset, num)

    client.channels.fetch(channel[offset])
        .then((channel: any) => {
            channel.send({ embeds: [embed(req.body, num, offset)], files: [file] });
        })
        .catch(console.error);

    res.send("YESS!!!");
});

export default routes