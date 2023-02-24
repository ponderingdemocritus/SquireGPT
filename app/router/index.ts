import { Router } from 'express';
import Agents from './agents';

const apiRouter = Router();

apiRouter.use('/', Agents);

export default  apiRouter
