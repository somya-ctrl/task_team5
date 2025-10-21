const bcrypt = require('bcrypt');
const User = require('../models/user');
async function createUser(req, res) {
   
    try {
        const user = new User(req.body);
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}
async function login (req,res){
    try{
        const{email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({error:'User not found'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({error:'Invalid credentials'});
        }
        res.status(200).json({message:'Login successful'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = { createUser, login };