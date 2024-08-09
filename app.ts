import express, { Request, response, Response } from 'express';
import { MongoClient } from 'mongodb';
// import { User } from './models/User';
// import User from './models/User';

const app = express();
const port: number = 3000;

const uri = require("./atlas_uri");
const client = new MongoClient(uri);
const dbname: string = "test";
const collection_name: string = "posts";
const usersCollection = client.db(dbname).collection(collection_name);

const userTest = {
  name: "test",
  email: "test@email",
  profession: "Programmer",
  age: 1,
  active: true
};

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

interface User {
  name: string;
  email: string;
  profession: string;
  age: number;
  active: boolean;
}

app.post('/users', (req: Request, res: Response) => {
 
});



const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to the ${dbname} database`)
  } catch (err) {
    console.error(`Error connection to the database: ${err}`);
  }
};

const main = async () => {
  try {
    await connectToDatabase();

    let result = usersCollection.find()
    let docCount = usersCollection.countDocuments()
    await result.forEach((doc) => console.log(doc))
    console.log(`Found ${await docCount} documents`)
  } catch (err) {
    console.error(`Error connection to the database: ${err}`);
  } finally {
    await client.close();
  }
};

main();