import express, { Express, Request, Response, NextFunction } from "express";
import { connect } from "./database/config";
import mongoose from "mongoose";
import routes from "./routes";
import responser from 'responser';

class App {
  public express: Express;

  constructor() {
    this.express = express();
    this.database();
    this.middlewares();
    this.routes();
    this.express.listen(1313, () => console.log(`Sua API REST está funcionando na porta 1313`));
  }

  private async database(): Promise<void> {
    await connect();
    mongoose.set('debug', true);
  }

  private middlewares(): void {
    this.express.use(express.json());
    this.express.use(responser);
  }

  private routes(): void {
    this.express.use("/", routes);
  }
}

export default new App().express;
