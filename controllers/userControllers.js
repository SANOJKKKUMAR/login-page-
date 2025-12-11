
const bcrypt = require("bcrypt");
const User = require("../models/user");
const path = require("path");
const jwt = require("jsonwebtoken");



// controllers/auth.js (example)
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // create minimal token payload
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || process.env.jwt_secret_key, { expiresIn: '1h' });

    // set cookie (HTTP server — change when you enable HTTPS)
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,       // set true after HTTPS
      sameSite: 'lax',     // use 'none' + secure:true for cross-site + HTTPS
      maxAge: 3600 * 1000, // 1 hour
      path: '/'
    });

    // send safe user data only (no password)
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      // add other public fields if needed
    };

    return res.status(200).json({ message: 'Login successful', user: safeUser, token });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


exports.register = async(req,res)=>{

    const { username, email, password} = req.body;
    try {
    const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, email, password : hashedPassword });
       return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}
