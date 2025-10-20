const express = require('express');
const cors = require('cors');

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
        const newUser = await User.create({ username, email, password });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username, password } });
        if (user) {
            res.status(200).json({ message: 'Login successful', user });
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