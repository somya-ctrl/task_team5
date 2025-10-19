const mongoose = require('mongoose');
async function connectmongoDB(user){
    try{
        await mongoose.connect(user);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
 }
module.exports={connectmongoDB};