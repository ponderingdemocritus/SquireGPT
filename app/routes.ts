require('dotenv').config();
import { Router } from 'express';
import client from './client';
import { MessageAttachment } from 'discord.js';

// const exampleReg = {
//     tokens: "100",
//     type: 1,
// }
const routes = Router();

const file = new MessageAttachment('app/img/lightning-strikes-sweet-dreams.gif');

const channel = process.env.LIGHT_CHANNEL_ID || ""

routes.get('/attack', (req: Request, res: any) => {
    console.log(req.body);

    const exampleEmbed = {
        title: 'Light has Boosted',
        image: {
            url: 'attachment://lightning-strikes-sweet-dreams.gif',
        },
    };

    client.channels.fetch(channel)
        .then((channel: any) => {
            channel.send({ embeds: [exampleEmbed], files: [file] });
        })
        .catch(console.error);
    res.send("hello");
});

export default routes