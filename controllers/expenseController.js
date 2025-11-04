const expense = require("../models/expenses");


exports.addExpense = async (req, res) => {
    console.log(req.body);
    const {userID, amount, description, category } = req.body;
    try {
        const newExpense = await expense.create({ userID ,amount, description, category });

const allExpenses = await expense.findAll({where :{userID : userID}});
console.log(allExpenses);
        res.status(201).json(allExpenses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }   

};



exports.getExpensesByUser  =  async (req, res) => {
    const userID = req.params.id;
    console.log(userID);
    try {
        const allExpenses = await expense.findAll({where :{userID}});
        res.status(200).json(allExpenses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteExpense= async (req, res) => {
    const expenseID = req.params.id;
    try {
        await expense.destroy({ where: { expenseID } });
        const allExpenses = await expense.findAll();
        res.status(200).json(allExpenses);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.updateExpense =  async (req, res) => {
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
};

exports.getExpensebyID = async (req, res) => {
    const expenseID = req.params.id;
    console.log(expenseID)
    try {
        const exp = await expense.findOne({ where: { expenseID } });
        res.status(200).json(exp);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
