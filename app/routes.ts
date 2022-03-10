require('dotenv').config();
import { Router } from 'express';
import client from './client';
import { MessageAttachment } from 'discord.js';
import { colours, text } from './db/desiege';
const exampleReg = {
    tokens: "100",
    type: 1,
}
const routes = Router();

const file = new MessageAttachment('app/img/lightning-strikes-sweet-dreams.gif');

const channel = ["951253679464394812", "951288986389864469"] // light 0, dark 1

const exampleEmbed = (offset: number) => {
    return {
        title: text[offset].title + " : " + exampleReg.tokens,
        description: text[offset].description,
        color: colours[offset],
        image: {
            url: 'attachment://lightning-strikes-sweet-dreams.gif',
        },
    }
};

routes.get('/action', (req: Request, res: any) => {
    console.log(req.body);
    client.channels.fetch(channel[0])
        .then((channel: any) => {
            channel.send({ embeds: [exampleEmbed(0)], files: [file] });
        })
        .catch(console.error);
    res.send("hello");
});

export default routes