const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));

mongoose.connect("mongodb://localhost:27017/Netflick")
.then(()=> {
    console.log("Database connected successfully");
})
.catch(() => {
    console.log("Database cnncetion failed");
})

const netflickRouter = require("./router/netflick");
app.use("/netflick", netflickRouter);


app.listen(3000, () =>{
    console.log("Server is running on http://localhost:3000/netflick/");
})