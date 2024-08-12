// import { MongoClient } from "mongodb";

// // const uri = "mongodb+srv://teste:teste@cluster0.jp8nunv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const uri = "MinhaStringAqui";

// export const connect = async () => {
//     try {
//         // const client = await MongoClient.connect(uri, { useNewUrlParser: true });
//         const client = await MongoClient.connect(uri);
//         console.log("Connected to MongoDB");
//         return client.db();
//     } catch (error) {
//         console.error("Error connecting to MongoDB", error);
//         throw error;
//     }
// }

import mongoose from 'mongoose';

const uri = "mongodb+srv://teste:teste@cluster0.jp8nunv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Tempo limite para seleção de servidor
            socketTimeoutMS: 45000, // Tempo limite para operações
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1); // Encerra o processo se não conseguir conectar
    }
};
