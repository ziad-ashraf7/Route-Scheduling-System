import express from "express";
const schedulerRouter = express.Router();

import { schedule, getDriverHistory } from '../Controllers/schedulerController.js';

schedulerRouter.get('/', schedule);

schedulerRouter.get('/drivers/:id/history', getDriverHistory);

export default schedulerRouter;