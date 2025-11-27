const sequelize = require("../config/db");
const expense = require("../models/expenses");
const { suggestCategory } = require("../utils/aiHelper");
const { Op } = require('sequelize'); // <-- add this
 // <-- Ye missing tha

exports.addExpense = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { userID, amount, description } = req.body;
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

 

exports.getExpensebyDate = async (req, res) => {
  const type  = req.query.type;
  const userID = req.query.userID;

  if(type === 'daily'){
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); 
    try {
      const expenses = await expense.findAll({
        where: {
          userID: userID,
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          } 
        },
      });
      res.status(200).json(expenses);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  if(type === 'weekly'){
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    try {
      const expenses = await expense.findAll({
        where: {
          userID: userID,
          createdAt: {
            [Op.between]: [startOfWeek, endOfWeek],
          },
        },
      });
      res.status(200).json(expenses);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  if(type === 'monthly'){
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    try {
      const expenses = await expense.findAll({
        where: {
          userID: userID,
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });
      res.status(200).json(expenses);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}


// GET /expenses?page=1&limit=10&userID=123

exports.getExpensebypage =  async (req, res) => {
  console.log("Pagination request received with query:-----------------------", req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userID = req.query.userID;

    const offset = (page - 1) * limit;

    try {
        // Get total count
        const totalItems = await expense.count({ where: { userId: userID } });

        // Get paginated rows
        const expenses = await expense.findAll({
            where: { userId: userID },
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            expenses,
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching expenses", error });
    }
}


// exports.getExpensebyDate = async (req, res) =>{
//   const type  = req.query.type;
//   const userID = req.query.userID;
//   console.log("typeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",type);
//   console.log("userIDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",userID);
//   if(type === 'daily'){
//     const today = new Date();
//     const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(today.setHours(23, 59, 59, 999)); 
//     try {
//       const expenses = await expense.findAll({
//         where: {
//           userID: userID,
//           createdAt: {
//             [sequelize.Op.between]: [startOfDay, endOfDay],
//           } 
//         },

//       });
//       console.log("Daily Expenses:", expenses);
//       res.status(200).json(expenses);

//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   }
//   if(type === 'weekly'){
//     const today = new Date();
//     const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
//     const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
//     try {
//       const expenses = await expense.findAll({
//         where: {
//           userID: userID,
//           createdAt: {
//             [sequelize.Op.between]: [startOfWeek, endOfWeek],
//           },
//         },
//       });
//       res.status(200).json(expenses);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   }
//   if(type === 'monthly'){
//     const today = new Date();
//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//     try {
//       const expenses = await expense.findAll({
//         where: {
//           userID: userID,
//           createdAt: {
//             [sequelize.Op.between]: [startOfMonth, endOfMonth],
//           },
//         },
//       });
//       res.status(200).json(expenses);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   }

// }

