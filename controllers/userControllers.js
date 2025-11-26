
const bcrypt = require("bcrypt");
const User = require("../models/user");
const path = require("path");
const jwt = require("jsonwebtoken");
const { maxHeaderSize } = require("http");




exports.loginUSer = async(req,res)=>{
 const { username, password } = req.body;
console.log("login request received for user:", username);
    try {
        const user = await User.findOne({ where: { username} });
        if (!user) {
            return res.status(500).json({ message: 'User not found' });
         
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(401).json({ message: 'Invalid credentials' });
        
        if (match) {
           const token = jwt.sign({ Email: user.email }, process.env.jwt_secret_key, { expiresIn: '1h' });

    


         res.cookie("token", token, {
            httpOnly: true,
            secure: false,        // localhost = false
            maxAge: 3600000,      // 1 hour
            sameSite: "none",
            path: "/",
     

  

});

        console.log("Login successful for user:", username);
        res.status(200).json({ message: 'Login successful', user, token });
    
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }   
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


exports.register = async(req,res)=>{
    console.log("register request received");
    const { username, email, password} = req.body;
    try {
    const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, email, password : hashedPassword });
       return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}
