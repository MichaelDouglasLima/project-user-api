import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    profession: String,
    age: Number,
    active: Boolean
});

const User = mongoose.model('User', userSchema);

export default User;