import express, { Request, Response } from 'express';
import UserController from './app/controller/UserController';

const routes = express.Router();

routes.get("/users/:id",  UserController.getById);
routes.get("/users",  UserController.index);
routes.post("/users",  UserController.store);
routes.patch("/users/:id",  UserController.partialUpdate);
routes.put("/users/:id",  UserController.update);
routes.delete("/users/:id",  UserController.delete);

export default routes;