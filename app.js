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

   userID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
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

const expense = sequelize.define('Expense', {
    expenseID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    userID: {
        foreignKey: true,
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
});


User.hasMany(expense, { foreignKey: 'userID' });
expense.belongsTo(User, { foreignKey: 'userID' });




sequelize.sync({ alter: true })
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
               return res.json({ message: 'Login successful by sanoj',user: { id: user.userID, username: user.username, email: user.email }
    });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    
       
        
       
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/expense', async (req, res) => {
    console.log(req.body);
    const {userID, amount, description, category } = req.body;
    try {
        const newExpense = await expense.create({ userID ,amount, description, category });

const allExpenses = await expense.findAll();
        res.status(201).json(allExpenses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }   

});



app.get('/expenses/:id', async (req, res) => {
    const userID = req.params.id;
    console.log(userID);
    try {
        const allExpenses = await expense.findAll({where :{userID}});
        res.status(200).json(allExpenses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/expense/:id', async (req, res) => {
    const expenseID = req.params.id;
    try {
        await expense.destroy({ where: { expenseID } });
        const allExpenses = await expense.findAll();
        res.status(200).json(allExpenses);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});



app.put('/expense/:id', async (req, res) => {
  const expenseID = req.params.id;
  console.log('Expense ID to update:', expenseID);
  console.log('Request body:', req.body);
  const { amount, description, category } = req.body;

  try {
    await expense.update(
      { amount, description, category },
      { where: { expenseID } }
    );
    const allExpenses = await expense.findAll({where: { expenseID }});
    res.status(200).json(allExpenses);

   
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/expense/:id", async (req, res) => {
    const expenseID = req.params.id;
    console.log(expenseID)
    try {
        const exp = await expense.findOne({ where: { expenseID } });
        res.status(200).json(exp);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});