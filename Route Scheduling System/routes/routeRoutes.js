import express from "express";
const routesRouter = express.Router();


import { createRoute, getAllRoutes, getRouteById } from '../Controllers/routeController.js';

routesRouter.post('/', createRoute);

routesRouter.get('/', getAllRoutes);

routesRouter.get('/:id', getRouteById);


export default routesRouter;