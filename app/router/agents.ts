require('dotenv').config();
import { getBlobert } from '../agents';
import { Router } from 'express';
// import client from '../services/discord';

const Agent = Router();


Agent.post('/chat', async (req: any, res: any) => {

    const { question } = req.body;

    let response;

    try {
        response = await getBlobert(question);
    } catch(e) {
        console.log(e)
    }

    res.send(response);
});

export default Agent
