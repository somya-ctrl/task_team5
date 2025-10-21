const express= require('express');

require('dotenv').config();
const mongoose = require('mongoose');
const {connectmongoDB} = require('./connect');
const userRoutes = require('./routes/user');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import cors from "cors";
app.use(cors({ origin: "http://localhost:5173" }));

const PORT = process.env.PORT;
app.use('/', userRoutes);


connectmongoDB(process.env.MONGO_URI);

app.get('/', (req, res) => {
    res.send('Hello, guys!');
});
app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);
});