import { Request, Response } from 'express';
import UserModel from '../model/User';
import mongoose from 'mongoose';

import express from 'express';
import responser from 'responser'

import requestCheck from 'request-check';

const app = express()
const routes = express.Router();

app.use(responser)
app.use(routes)

class UserController {
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const rc = requestCheck();
            rc.addRule('id', {
                validator: (id: string) => mongoose.Types.ObjectId.isValid(id),
                message: 'ID Invalid!'
            })

            const errors = rc.check (
                { id }
            )

            if (errors) {
                console.log(errors)
                return res.send_badRequest('Bad Request', errors);
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
            const { name, email, profession } = req.body;

            const rc = requestCheck();

            rc.addRule('name', {
                validator: (name: string) => name.length >= 3,
                message: 'Name must be 3 characters or more!'
            });

            rc.addRule('email', {
                validator: (name: string) => name.includes('@'),
                message: 'Email Invalid!'
            });

            rc.addRule('profession', {
                validator: (profession: string) => profession.length >= 3,
                message: 'Profession must be 3 characters or more!'
            });

            const errors = rc.check (
                { name },
                { email },
                { profession }
            )

            if (errors) {
                console.log(errors)
                return res.send_badRequest('Bad Request', errors);
            }

            const user = await UserModel.create(req.body);

            return res.send_created('Created', {
                user
            })
        } catch (error) {
            return res.send_internalServerError('Internal Server Error');
        }
    }
   
    async index(req: Request, res: Response) {
        try {
            const users = await UserModel.find({}).exec();
            return res.send_ok('Users were found successfully', {
                users
            });
        } catch (error) {
            return res.send_internalServerError('Internal Server Error');
        }
    }

    async partialUpdate(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const rc = requestCheck();
            rc.addRule('id', {
                validator: (id: string) => mongoose.Types.ObjectId.isValid(id),
                message: 'ID Invalid!'
            })

            const errors = rc.check (
                { id }
            )

            if (errors) {
                console.log(errors)
                return res.send_badRequest('Bad Request', errors);
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

            const rc = requestCheck();
            rc.addRule('id', {
                validator: (id: string) => mongoose.Types.ObjectId.isValid(id),
                message: 'ID Invalid!'
            })

            const errors = rc.check (
                { id }
            )

            if (errors) {
                console.log(errors)
                return res.send_badRequest('Bad Request', errors);
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

            const rc = requestCheck();
            rc.addRule('id', {
                validator: (id: string) => mongoose.Types.ObjectId.isValid(id),
                message: 'ID Invalid!'
            })

            const errors = rc.check (
                { id }
            )

            if (errors) {
                console.log(errors)
                return res.send_badRequest('Bad Request', errors);
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
