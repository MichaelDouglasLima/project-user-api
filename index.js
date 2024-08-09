const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

const { MongoClient } = require("mongodb");
const uri = require("./atlas_uri");

const client = new MongoClient(uri);
const dbname = "test";
const collection_name = "users"

const usersCollection = client.db(dbname).collection(collection_name)

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
    } catch (error) {
        console.error(`Error connection to the database: ${err}`);
    } finally {
        await client.close();
    }
};

main();

app.post('/', (req, res) => {
    res.send('POST request to the homepage')
})

app.post('/users', (req, res) => {
    if (variableName !== null && variableName !== undefined && variableName._id) {
        const newUser = req.body;
        usersCollection.insertOne(newUser, (err, result) => {
            if (err) {
                res.status(500).send('Error adding user');
            } else {
                res.status(201).send('User added successfully');
            }
        });
    }
})
