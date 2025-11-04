
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.register = async(req,res)=>{
    const { username, email, password} = req.body;
    try {
    const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, email, password : hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


exports.loginUSer = async(req,res)=>{
 const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username} });
        if (!user) {
 res.status(401).json({ message: 'Invalid credentials' });
           
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
               return res.json({ message: 'Login successful by sanoj',user: { id: user.userID, username: user.username, email: user.email }
    });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    
       
        
       
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

