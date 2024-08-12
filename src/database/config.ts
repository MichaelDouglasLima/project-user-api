import mongoose from 'mongoose';

const uri = "mongodb+srv://teste:teste@cluster0.jp8nunv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
};
