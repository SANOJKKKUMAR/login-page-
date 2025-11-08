const sequelize = require("../config/db");
const expense = require("../models/expenses");


// exports.addExpense = async (req, res) => {
//     console.log(req.body);
//     const {userID, amount, description, category } = req.body;
//     try {
//         const newExpense = await expense.create({ userID ,amount, description, category });

// const allExpenses = await expense.findAll({where :{userID : userID}});
// console.log(allExpenses);
//         res.status(201).json(allExpenses);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }   

// };


const { suggestCategory } = require("../utils/aiHelper");


exports.addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userID, amount, description } = req.body;

    // ✅ Call AI to auto-categorize
    const category = await suggestCategory(description);
    console.log("cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",category);

    const newExpense = await expense.create({
      userID,
      amount,
      description,
      category,
    },{transaction : t});
    await t.commit();
    res.status(200).json(newExpense);


  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ error: "Failed to add expense" });
    await t.rollback();
  }
};


// exports.addExpense = async (req, res) => {
//   try {
//     const { userID, amount, description, category } = req.body;
//     console.log("---------------ccccccccccccccccc",category);

//     // If no category provided, let AI guess one
//     let finalCategory = category;
//     if (!finalCategory || finalCategory.trim() === "") {
//       finalCategory = await suggestCategory(description);
//       console.log("api -------------------------------------------------called");
//     }

//     const newExpense = await expense.create({
//       userID,
//       amount,
//       description,
//       category: finalCategory,
//     });

//     res.json({
//       success: true,
//       message: "Expense added successfully",
//       expense: newExpense,
//     });
//   } catch (error) {
//     console.error("Error adding expense:", error);
//     res.status(500).json({ error: "Failed to add expense" });
//   }
// };


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
