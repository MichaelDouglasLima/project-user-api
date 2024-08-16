import { Request, Response } from 'express';
import UserModel from '../model/User';
import mongoose from 'mongoose';
import express from 'express';
import responser from 'responser';
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
                message: 'ID Inválido!'
            })

            const errors = rc.check(
                { id }
            )

            if (errors) {
                console.log(errors)
                return res.send_badRequest('Requisição Ruim', errors);
            }

            const user = await UserModel.findById(id).exec();
            if (!user) {
                return res.send_notFound('Usuário não encontrado');
            }

            return res.send_ok('Usuário foi encontrado com successo', {
                user
            });
        } catch (error) {
            return res.send_internalServerError('Erro interno do servidor');
        }
    }

    async store(req: Request, res: Response) {
        try {
            const { name, email, profession } = req.body;

            const rc = requestCheck();

            rc.addRule('name', {
                validator: (name: string) => name.length >= 3,
                message: 'Nome precisa ter 3 caracteres ou mais!'
            });

            rc.addRule('email', {
                validator: (email: any) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
                message: 'Email Inválido, precisa ser um email válido!'
            });

            rc.addRule('profession', {
                validator: (profession: string) => profession.length >= 3,
                message: 'Profissão precisa ter 3 caracteres ou mais!'
            });

            const errors = rc.check(
                { name },
                { email },
                { profession }
            )

            if (errors) {
                console.log(errors)
                return res.send_unprocessableEntity('Entidade do Usuário Improcessável', errors);
            }

            const user = await UserModel.create(req.body);

            return res.send_created('Usuário criado com sucesso', {
                user
            })
        } catch (error) {
            return res.send_internalServerError('Erro interno do servidor');
        }
    }

    async index(req: Request, res: Response) {
        try {
            const users = await UserModel.find({}).exec();
            return res.send_ok('Usuários foram encontrados com sucesso', {
                users
            });
        } catch (error) {
            return res.send_internalServerError('Erro interno do servidor');
        }
    }

    async partialUpdate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateFields = req.body;

            const rc = requestCheck();
            rc.addRule('id', {
                validator: (id: string) => mongoose.Types.ObjectId.isValid(id),
                message: 'ID Inválido!'
            });

            const errors = rc.check({ id });
            if (errors) {
                console.log(errors);
                return res.send_badRequest('Requisição Ruim', errors);
            }

            const updateCheck = requestCheck();
            const validationErrors: Record<string, any> = {};

            if (updateFields.name !== undefined) {
                updateCheck.addRule('name', {
                    validator: (name: any) => typeof name === 'string' && name.length >= 3,
                    message: 'Nome precisa ter 3 caracteres ou mais!'
                });
                const nameErrors = updateCheck.check({ name: updateFields.name });
                if (nameErrors) {
                    validationErrors.name = nameErrors;
                }
            }

            if (updateFields.email !== undefined) {
                updateCheck.addRule('email', {
                    validator: (email: any) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
                    message: 'Email Inválido, precisa ser um email válido!'
                });
                const emailErrors = updateCheck.check({ email: updateFields.email });
                if (emailErrors) {
                    validationErrors.email = emailErrors;
                }
            }

            if (updateFields.profession !== undefined) {
                updateCheck.addRule('profession', {
                    validator: (profession: any) => typeof profession === 'string' && profession.length >= 3,
                    message: 'Profissão precisa ter 3 caracteres ou mais!'
                });
                const professionErrors = updateCheck.check({ profession: updateFields.profession });
                if (professionErrors) {
                    validationErrors.profession = professionErrors;
                }
            }

            if (Object.keys(validationErrors).length > 0) {
                console.log(validationErrors);
                return res.send_unprocessableEntity('Entidade do Usuário Improcessável', validationErrors);
            }

            const user = await UserModel.findByIdAndUpdate(id, updateFields, { new: true }).exec();
            if (!user) {
                return res.send_notFound('Usuário não encontrado');
            }

            return res.send_ok('Usuário atualizado com sucesso', { user });
        } catch (error) {
            console.error(error);
            return res.send_internalServerError('Erro interno do servidor');
        }
    }


    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, email, profession } = req.body;

            const rc = requestCheck();
            rc.addRule('id', {
                validator: (id: string) => mongoose.Types.ObjectId.isValid(id),
                message: 'ID Inválido!'
            });

            const errors = rc.check({ id });
            if (errors) {
                console.log(errors);
                return res.send_badRequest('Requisição Ruim', errors);
            }

            const updateCheck = requestCheck();

            updateCheck.addRule('name', {
                validator: (name: string) => typeof name === 'string' && name.length >= 3,
                message: 'Nome precisa ter 3 caracteres ou mais!'
            });

            updateCheck.addRule('email', {
                validator: (email: any) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
                message: 'Email Inválido, precisa ser um email válido!'
            });

            updateCheck.addRule('profession', {
                validator: (profession: string) => typeof profession === 'string' && profession.length >= 3,
                message: 'Profissão precisa ter 3 caracteres ou mais!'
            });

            const updateErrors = updateCheck.check(
                { name },
                { email },
                { profession }
            );

            if (updateErrors) {
                console.log(updateErrors);
                return res.send_unprocessableEntity('Entidade do Usuário Improcessável', updateErrors);
            }

            const result = await UserModel.replaceOne({ _id: id }, { name, email, profession });
            if (result.matchedCount === 0) {
                return res.send_notFound('Usuário não encontrado');
            }

            const updatedUser = await UserModel.findById(id).exec();
            return res.send_ok('Usuário atualizado com sucesso', { user: updatedUser });
        } catch (error) {
            console.error(error);
            return res.send_internalServerError('Erro interno do servidor');
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const rc = requestCheck();
            rc.addRule('id', {
                validator: (id: string) => mongoose.Types.ObjectId.isValid(id),
                message: 'ID Inválido!'
            })

            const errors = rc.check(
                { id }
            )

            if (errors) {
                console.log(errors)
                return res.send_badRequest('Requisição Ruim', errors);
            }

            const result = await UserModel.findByIdAndDelete(id).exec();
            if (!result) {
                return res.send_notFound('Usuário não encontrado');
            }

            return res.send_ok('Usuário deletado com sucesso');
        } catch (error) {
            return res.send_internalServerError('Erro interno do servidor');
        }
    }
}

export default new UserController();
