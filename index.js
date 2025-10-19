const express= require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const {connectmongoDB} = require('./connect');
const app = express();

const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectmongoDB(process.env.MONGO_URI);

app.get('/', (req, res) => {
    res.send('Hello, guys!');
});
app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);
});