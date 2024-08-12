import express, { Request, Response } from 'express';
import UserController from './app/controller/UserController';

const routes = express.Router();

routes.get("/users/:id", (req: Request, res: Response) => UserController.getById(req, res));
routes.get("/users", (req: Request, res: Response) => UserController.index(req, res));
routes.post("/users", (req: Request, res: Response) => UserController.store(req, res));
routes.patch("/users/:id", (req: Request, res: Response) => UserController.partialUpdate(req, res));
routes.put("/users/:id", (req: Request, res: Response) => UserController.update(req, res));
routes.delete("/users/:id", (req: Request, res: Response) => UserController.delete(req, res));

export default routes;