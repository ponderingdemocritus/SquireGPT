require('dotenv').config();
import { Router } from 'express';
import client from '../services/discord';
import { Briq, Wonder } from '../types';

const BriqRouter = Router();

const wonder = (wonder: Wonder) => {
    return {
        title: wonder.name,
        description: wonder.minter,
        image: {
            url: wonder.image,
        },
        timestamp: new Date()
    }
}

BriqRouter.post('/briq', (req: Briq, res: any) => {

    console.log(req.body)

    // tweet
    // tweet(req.body, offset, num)

    client.channels.fetch('885089924662046720')
        .then((channel: any) => {
            channel.send({
                embeds: [wonder(req.body)]
            });
        })
        .catch(console.error);

    res.send("YESS!!!");
});

export default BriqRouter
