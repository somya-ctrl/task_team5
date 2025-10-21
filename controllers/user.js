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
module.exports = { createUser };