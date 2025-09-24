import express from 'express'
import { createDriver, getAllDrivers, getDriverById } from '../Controllers/driverController.js'
const driverRouter = express.Router();

driverRouter.post('/', createDriver);

driverRouter.get('/', getAllDrivers);

driverRouter.get('/:id', getDriverById);

export default driverRouter;