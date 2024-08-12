import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    profession: string;
}

const UserSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    profession: {
        type: String,
        required: true,
    },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
