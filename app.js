const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
app.use(cors());
const port = 3000;
const {Sequelize ,DataTypes} = require("sequelize");

app.use(express.json());

const sequelize = new Sequelize('login','root', 'Sanoj@500r7', {
    host: 'localhost',
    dialect: 'mysql'
});

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email : {type:DataTypes.STRING,allowNull :false},
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

app.post('/register', async (req, res) => {
    const { username, email, password} = req.body;
    try {
    const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, email, password : hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username} });
        if (!user) {
 res.status(401).json({ message: 'Invalid credentials' });
           
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
               return res.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email }
    });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    
       
        
       
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});