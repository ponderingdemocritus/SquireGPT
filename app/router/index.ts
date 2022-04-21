import { Router } from 'express';
import BriqRouter from './briq';
import DesiegeRouter from './desiege';

const apiRouter = Router();

apiRouter.use('/', BriqRouter);
apiRouter.use('/', DesiegeRouter);

export default  apiRouter
