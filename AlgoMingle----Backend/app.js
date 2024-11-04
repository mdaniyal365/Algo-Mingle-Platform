require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser")
const user = require("./routes/user")
const app = express();
const cors = require("cors");
const connectToDB = require("./config/db")
const interview = require("./routes/interview")
const path = require("path");

// app.use(express.static(path.join(__dirname,'build')));


app.use(express.json());
app.use(cookieParser());
connectToDB();
app.use(morgan("tiny"))
app.use(cors())
app.use('/api/v1' , user);
app.use('/api/v1' , interview);

app.get("/" , (req , res) => {
    res.status(200).json({
        message : "Backend chal raha hai ..."
    })
})
// app.get("/*" , (req , res) => {
//     res.sendFile(path.join(__dirname , 'build' , 'index.html'));
// })

app.use(function(err , req , res , next){
    console.log(err);
    res.status(500).json({
        msg : "Internal Server Error"
    })
})




module.exports = app;