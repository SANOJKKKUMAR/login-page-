const cors = require("cors");
const express = require("express");
const sequelize= require("./config/db")
const app = express();
const userRoute = require("./routes/useroutes");
const expenseroute = require("./routes/expenseRoute");
const paymentRoute = require("./routes/paymentsroute");
const path = require("path");
const leaderboardRoute = require("./routes/leaderbord");


app.use(express.static(path.join(__dirname, "public")));



app.use(cors());
app.use(express.json());

app.use("/",userRoute);
app.use("/",expenseroute);

app.use("/payment", paymentRoute);
app.use("/user",paymentRoute);

app.use("/leaderboard", leaderboardRoute);

console.log("------------------------------------------for leader bord");
sequelize.sync()
.then(()=>{
    console.log("table creted");
})
.catch((eror)=>{
    console.log("eroro during table creation", eror)
});


app.use((err, req, res, next) => {
  console.error(" Express Error:", err.stack); // full stack trace
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

app.listen(3000,()=>{
    console.log("rut at http//localhost:3000");
});