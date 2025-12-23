const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

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
//app.use(helmet());
const compression = require("compression");
app.use(compression());
app.use(morgan("common"));
app.use(helmet({
  contentSecurityPolicy: false
}));



app.use(cors({
    origin: ["http://3.111.53.36:3000", "http://localhost:3000"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true
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
app.use("/leaderboard", leaderboardRoute);


app.get("/reset-password/:token", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "verfy-user.html"));
});

// app.js
app.get("/api/health", (req, res) => {
  res.send("API updated successfully");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running at port", PORT);
});