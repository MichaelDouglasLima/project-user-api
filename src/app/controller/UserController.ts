import { Request, Response } from 'express';
import UserModel from '../model/User';
import mongoose from 'mongoose';

class UserController {
    async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }
            const user = await UserModel.findById(id).exec();
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async store(req: Request, res: Response): Promise<Response> {
        try {
            const data = await UserModel.create(req.body);
            return res.status(201).json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async index(req: Request, res: Response): Promise<Response> {
        try {
            const data = await UserModel.find({}).exec();
            return res.json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async partialUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }

            const updatedData: Record<string, any> = {};
            const updateOps = Object.keys(req.body);

            updateOps.forEach(op => {
                updatedData[op] = req.body[op];
            });

            const data = await UserModel.findByIdAndUpdate(id, updatedData, { new: true }).exec();
            if (!data) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }

            const data = await UserModel.findByIdAndUpdate(id, req.body, { new: true }).exec();
            if (!data) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json(data);
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }

            const result = await UserModel.findByIdAndDelete(id).exec();
            if (!result) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default new UserController();
