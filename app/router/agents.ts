require('dotenv').config();
import { ConversationAgent } from '../agents';
import { Router } from 'express';
import { agentConfig } from '../config/index';

const Agent = Router();

Router().post('/chat', async (req: any, res: any) => {

    const { question } = req.body;

    let response;

    const chat = new ConversationAgent(agentConfig.context);

    try {
        response = await chat.getResponse(question);
    } catch (e) {
        console.log(e)
    }

    res.send(JSON.stringify({ data: response }));
});

export default Agent
