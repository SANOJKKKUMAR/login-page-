const cors = require("cors");
const express = require("express");
const sequelize= require("./config/db")
const app = express();
const userRoute = require("./routes/useroutes");
const expenseroute = require("./routes/expenseRoute");
const paymentRoute = require("./routes/paymentsroute");
const path = require("path");
const leaderboardRoute = require("./routes/leaderbord");
const forget = require("./routes/forget-passwordroute");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
}));

app.use(express.json());
sequelize.sync()
.then(()=>{
    console.log("table creted");
})
.catch((eror)=>{
    console.log("eroro during table creation", eror)
});
app.use("/user",userRoute);
app.use("/expenses"  ,expenseroute);
app.use("/payment", paymentRoute);
app.use("/password", forget);
// app.use("/user",paymentRoute);
app.use("/leaderboard", leaderboardRoute);


app.get("/reset-password/:token", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "verfy-user.html"));
});

app.listen(3000,()=>{
    console.log("rut at http//localhost:3000");
});