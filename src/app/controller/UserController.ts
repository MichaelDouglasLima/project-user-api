import { Request, Response } from 'express';
import UserModel from '../model/User';
import mongoose from 'mongoose';

import express from 'express';
import responser from 'responser'

const app = express()
const routes = express.Router();

app.use(responser)
app.use(routes)

class UserController {
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.send_badRequest('Bad Request')
            }
            const user = await UserModel.findById(id).exec();
            if (!user) {
                return res.send_notFound('User Not Found');
            }
            return res.send_ok('User were found successfully', {
                user
            });
        } catch (error) {
            return res.send_internalServerError('Internal Server Error');
        }
    }

    async store(req: Request, res: Response) {
        try {
            const data = await UserModel.create(req.body);
            return res.send_created('Created', {
                data
            })
        } catch (error) {
            return res.send_internalServerError('Internal Server Error');
        }
    }
   
    async index(req: Request, res: Response) {
        try {
            const data = await UserModel.find({}).exec();
            return res.send_ok('Users were found successfully', {
                data
            });
        } catch (error) {
            return res.send_internalServerError('Internal Server Error');
        }
    }

    async partialUpdate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.send_badRequest('Bad Request')
            }

            const updatedData: Record<string, any> = {};
            const updateOps = Object.keys(req.body);

            updateOps.forEach(op => {
                updatedData[op] = req.body[op];
            });

            const data = await UserModel.findByIdAndUpdate(id, updatedData, { new: true }).exec();
            if (!data) {
                return res.send_notFound('Not Found');
            }
            return res.send_created('Created', {
                data
            })
        } catch (error) {
            return res.send_internalServerError('Internal Server Error');
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.send_badRequest('Bad Request');
            }

            const data = await UserModel.findByIdAndUpdate(id, req.body, { new: true }).exec();
            if (!data) {
                return res.send_notFound('User Not Found');
            }
            return res.send_created('Created', {
                data
            })
        } catch (error) {
            return res.send_internalServerError('Internal Server Error');
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.send_badRequest('Bad Request');
            }

            const result = await UserModel.findByIdAndDelete(id).exec();
            if (!result) {
                return res.send_notFound('User Not Found');
            }
            return res.send_noContent('No Content');
        } catch (error) {
            return res.send_internalServerError('Internal Server Error');
        }
    }
}

export default new UserController();
