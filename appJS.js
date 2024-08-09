const express = require('express');
const app = express();
const port = 3000;

const userRoutes = require('./routes/UserRoute');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})



app.get('/users', (req, res) => {
    res.send('Os usuários serão retornados aqui!');
})