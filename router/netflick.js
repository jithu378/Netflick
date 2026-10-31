const express = require("express");
const router = express.Router();

const movie = require("../models/movieModel");

router.get("/", (req,res) => {
    res.render("index");
})

router.get("/admin", (req,res) => {
    res.render("admin");
})

module.exports=router;